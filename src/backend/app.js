const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDatabase } = require('./config/db');
const ShipmentModel = require('./models/ShipmentModel');
const RouteModel = require('./models/RouteModel');
const { shipments: fallbackShipments, disruptions, carriers } = require('./mock/sampleData');
const { successResponse, errorResponse } = require('./utils/response');
const { assessRisk } = require('./services/riskAssessmentService');
const { recommendRoute } = require('./services/routeRecommendationService');
const { recommendCarrier } = require('./services/carrierRecommendationService');
const { getAffectedShipments } = require('./services/affectedShipmentService');
const aiRoutes = require('./routes/aiRoutes');
const bobRoutes = require('./routes/bobRoutes');
const fleetRoutes = require('./routes/fleetRoutes');
const coldChainRoutes = require('./routes/coldChainRoutes');

dotenv.config();

connectDatabase().catch(err => console.warn(`[DB Connect Warning] ${err.message}`));

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_BAD_REQUEST = 'VALIDATION_ERROR';

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function validateRequiredFields(payload, requiredFields) {
  const missing = requiredFields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw Object.assign(new Error(`Missing required fields: ${missing.join(', ')}`), {
      statusCode: 400,
      code: DEFAULT_BAD_REQUEST,
    });
  }
}

function validateShipment(payload) {
  validateRequiredFields(payload, ['shipmentId', 'trackingNumber', 'origin', 'destination', 'cargoType', 'priority', 'status', 'estimatedDeparture', 'estimatedArrival']);
  if (!payload.origin || typeof payload.origin !== 'object') throw Object.assign(new Error('origin must be an object'), { statusCode: 400, code: DEFAULT_BAD_REQUEST });
  if (!payload.destination || typeof payload.destination !== 'object') throw Object.assign(new Error('destination must be an object'), { statusCode: 400, code: DEFAULT_BAD_REQUEST });
  if (Number.isNaN(Date.parse(payload.estimatedDeparture))) throw Object.assign(new Error('estimatedDeparture must be a valid ISO date string'), { statusCode: 400, code: DEFAULT_BAD_REQUEST });
  if (Number.isNaN(Date.parse(payload.estimatedArrival))) throw Object.assign(new Error('estimatedArrival must be a valid ISO date string'), { statusCode: 400, code: DEFAULT_BAD_REQUEST });
}

function validateDisruption(payload) {
  validateRequiredFields(payload, ['disruptionId', 'type', 'name', 'severity', 'status', 'startTime']);
  if (!['weather', 'port-strike', 'port-closure', 'road-closure', 'geopolitical', 'natural-disaster', 'carrier-disruption', 'other'].includes(payload.type)) {
    throw Object.assign(new Error('type is invalid'), { statusCode: 400, code: DEFAULT_BAD_REQUEST });
  }
  if (!['low', 'medium', 'high', 'critical'].includes(payload.severity)) {
    throw Object.assign(new Error('severity is invalid'), { statusCode: 400, code: DEFAULT_BAD_REQUEST });
  }
  if (!['active', 'monitoring', 'cleared'].includes(payload.status)) {
    throw Object.assign(new Error('status is invalid'), { statusCode: 400, code: DEFAULT_BAD_REQUEST });
  }
  if (Number.isNaN(Date.parse(payload.startTime))) throw Object.assign(new Error('startTime must be a valid ISO date string'), { statusCode: 400, code: DEFAULT_BAD_REQUEST });
}

function validateRouteRecommendation(payload) {
  validateRequiredFields(payload, ['shipmentId']);
}

function validateCarrierRecommendation(payload) {
  validateRequiredFields(payload, ['shipmentId']);
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', dbConnected: isDbConnected() }, message: 'Backend is running.' });
});

/**
 * GET /api/shipments/stats — Aggregated Dashboard statistics calculated live from MongoDB
 */
app.get('/api/shipments/stats', async (req, res) => {
  try {
    if (isDbConnected()) {
      const totalShipments = await ShipmentModel.countDocuments();
      if (totalShipments > 0) {
        const [statusStats, riskStats, financialStats] = await Promise.all([
          ShipmentModel.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ]),
          ShipmentModel.countDocuments({ lateDeliveryRisk: 1 }),
          ShipmentModel.aggregate([
            {
              $group: {
                _id: null,
                totalSales: { $sum: '$salesUSD' },
                totalProfit: { $sum: '$profitUSD' }
              }
            }
          ])
        ]);

        const statusCounts = {
          'in-transit': 0,
          'delivered': 0,
          'delayed': 0,
          'cancelled': 0,
          'planned': 0
        };
        statusStats.forEach(item => {
          if (item._id && statusCounts[item._id] !== undefined) {
            statusCounts[item._id] = item.count;
          }
        });

        const sales = financialStats[0]?.totalSales || 0;
        const profit = financialStats[0]?.totalProfit || 0;

        return res.status(200).json(successResponse({
          totalShipments,
          inTransit: statusCounts['in-transit'],
          delivered: statusCounts['delivered'],
          delayed: statusCounts['delayed'],
          cancelled: statusCounts['cancelled'],
          planned: statusCounts['planned'],
          atRisk: riskStats,
          totalSalesUSD: Math.round(sales),
          totalProfitUSD: Math.round(profit),
          dataSource: 'DataCo Supply Chain Dataset'
        }, 'Live DataCo shipment statistics calculated from MongoDB.'));
      }
    }

    return res.status(200).json(successResponse({
      totalShipments: fallbackShipments.length,
      inTransit: fallbackShipments.filter(s => s.status === 'in-transit').length,
      delivered: fallbackShipments.filter(s => s.status === 'delivered').length,
      delayed: fallbackShipments.filter(s => s.status === 'delayed').length,
      cancelled: 0,
      atRisk: fallbackShipments.filter(s => s.disruptionExposure === 'high').length,
      dataSource: 'DataCo Supply Chain Dataset (Offline Fallback)'
    }, 'Shipment stats calculated.'));
  } catch (err) {
    console.error(`[API /api/shipments/stats Error] ${err.message}`);
    return res.status(500).json(errorResponse('SERVER_ERROR', err.message, 500));
  }
});

/**
 * GET /api/shipments — Paginated, searchable, filterable shipment records from MongoDB
 */
app.get('/api/shipments', async (req, res) => {
  try {
    if (isDbConnected()) {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 50;
      const skip = (page - 1) * limit;

      const query = {};

      if (req.query.status && req.query.status !== 'all') {
        query.status = req.query.status.toLowerCase();
      }
      if (req.query.priority && req.query.priority !== 'all') {
        query.priority = req.query.priority.toLowerCase();
      }
      if (req.query.shippingMode && req.query.shippingMode !== 'all') {
        query.shippingMode = new RegExp(req.query.shippingMode, 'i');
      }

      if (req.query.search || req.query.q) {
        const searchTerm = (req.query.search || req.query.q).trim();
        const regex = new RegExp(searchTerm, 'i');
        query.$or = [
          { shipmentId: regex },
          { trackingNumber: regex },
          { orderId: regex },
          { cargoType: regex },
          { categoryName: regex },
          { 'origin.city': regex },
          { 'origin.country': regex },
          { 'destination.city': regex },
          { 'destination.country': regex }
        ];
      }

      const totalCount = await ShipmentModel.countDocuments(query);
      if (totalCount > 0) {
        const shipments = await ShipmentModel.find(query)
          .sort({ createdAt: -1, estimatedDeparture: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

        return res.status(200).json(successResponse({
          shipments,
          totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          dataSource: 'DataCo Supply Chain Dataset'
        }, 'DataCo shipments retrieved successfully.'));
      }
    }

    return res.status(200).json(successResponse({
      shipments: fallbackShipments,
      totalCount: fallbackShipments.length,
      page: 1,
      limit: fallbackShipments.length,
      totalPages: 1,
      dataSource: 'Fallback Demo Shipments'
    }, 'Shipments retrieved successfully.'));
  } catch (err) {
    console.error(`[API /api/shipments Error] ${err.message}`);
    return res.status(500).json(errorResponse('SERVER_ERROR', err.message, 500));
  }
});

app.get('/api/shipments/affected', async (req, res) => {
  try {
    if (isDbConnected()) {
      const affected = await ShipmentModel.find({
        $or: [
          { status: 'delayed' },
          { lateDeliveryRisk: 1 }
        ]
      }).limit(100).lean();

      if (affected.length > 0) {
        return res.status(200).json(successResponse({
          shipments: affected,
          totalCount: affected.length,
          dataSource: 'DataCo Supply Chain Dataset'
        }, 'Affected DataCo shipments retrieved successfully.'));
      }
    }

    const fallbackData = getAffectedShipments();
    return res.status(200).json(successResponse({ shipments: fallbackData, totalCount: fallbackData.length }, 'Affected shipments analyzed.'));
  } catch (err) {
    return res.status(500).json(errorResponse('SERVER_ERROR', err.message, 500));
  }
});

app.get('/api/shipments/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const shipment = await ShipmentModel.findOne({ shipmentId: req.params.id }).lean();
      if (shipment) {
        return res.status(200).json(successResponse({ shipment }, 'Shipment details retrieved successfully.'));
      }
    }

    const fallback = fallbackShipments.find((item) => item.shipmentId === req.params.id);
    if (fallback) {
      return res.status(200).json(successResponse({ shipment: fallback }, 'Shipment details retrieved successfully.'));
    }

    return res.status(404).json(errorResponse('SHIPMENT_NOT_FOUND', `Shipment ${req.params.id} was not found.`, 404));
  } catch (err) {
    return res.status(500).json(errorResponse('SERVER_ERROR', err.message, 500));
  }
});

app.post('/api/shipments', async (req, res) => {
  try {
    validateShipment(req.body);

    if (isDbConnected()) {
      const shipmentDoc = new ShipmentModel(req.body);
      await shipmentDoc.save();
      return res.status(201).json(successResponse({ shipment: shipmentDoc }, 'Shipment created successfully.', 201));
    }

    const shipment = { ...req.body };
    fallbackShipments.push(shipment);
    return res.status(201).json(successResponse({ shipment }, 'Shipment created successfully.', 201));
  } catch (error) {
    return res.status(error.statusCode || 400).json(errorResponse(error.code || DEFAULT_BAD_REQUEST, error.message || 'Invalid shipment payload.'));
  }
});

app.put('/api/shipments/:id', async (req, res) => {
  try {
    validateShipment(req.body);

    if (isDbConnected()) {
      const updated = await ShipmentModel.findOneAndUpdate(
        { shipmentId: req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (updated) {
        return res.status(200).json(successResponse({ shipment: updated }, 'Shipment updated successfully.'));
      }
    }

    const index = fallbackShipments.findIndex((item) => item.shipmentId === req.params.id);
    if (index === -1) {
      return res.status(404).json(errorResponse('SHIPMENT_NOT_FOUND', `Shipment ${req.params.id} was not found.`, 404));
    }
    fallbackShipments[index] = { ...fallbackShipments[index], ...req.body };
    return res.status(200).json(successResponse({ shipment: fallbackShipments[index] }, 'Shipment updated successfully.'));
  } catch (error) {
    return res.status(error.statusCode || 400).json(errorResponse(error.code || DEFAULT_BAD_REQUEST, error.message || 'Invalid shipment payload.'));
  }
});

app.delete('/api/shipments/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const deleted = await ShipmentModel.findOneAndDelete({ shipmentId: req.params.id });
      if (deleted) {
        return res.status(200).json(successResponse({ shipment: deleted }, 'Shipment deleted successfully.'));
      }
    }

    const index = fallbackShipments.findIndex((item) => item.shipmentId === req.params.id);
    if (index === -1) {
      return res.status(404).json(errorResponse('SHIPMENT_NOT_FOUND', `Shipment ${req.params.id} was not found.`, 404));
    }
    const [deleted] = fallbackShipments.splice(index, 1);
    return res.status(200).json(successResponse({ shipment: deleted }, 'Shipment deleted successfully.'));
  } catch (err) {
    return res.status(500).json(errorResponse('SERVER_ERROR', err.message, 500));
  }
});

/**
 * GET /api/routes — Retrieve real DataCo-derived routes from MongoDB
 */
app.get('/api/routes', async (req, res) => {
  try {
    if (isDbConnected()) {
      const limit = parseInt(req.query.limit, 10) || 100;
      const page = parseInt(req.query.page, 10) || 1;
      const skip = (page - 1) * limit;

      const totalCount = await RouteModel.countDocuments();
      if (totalCount > 0) {
        const dbRoutes = await RouteModel.find().skip(skip).limit(limit).lean();

        return res.status(200).json(successResponse({
          routes: dbRoutes,
          totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          dataSource: 'DataCo Supply Chain Dataset'
        }, 'DataCo routes retrieved successfully.'));
      }
    }
    const { routes: fallbackRoutes } = require('./mock/sampleData');
    return res.status(200).json(successResponse({ routes: fallbackRoutes, totalCount: fallbackRoutes.length }, 'Routes retrieved.'));
  } catch (err) {
    return res.status(500).json(errorResponse('SERVER_ERROR', err.message, 500));
  }
});

app.get('/api/disruptions', (req, res) => {
  res.status(200).json(successResponse({ disruptions, totalCount: disruptions.length }, 'Active disruptions retrieved.'));
});

app.get('/api/disruptions/:id', (req, res) => {
  const disruption = disruptions.find((item) => item.disruptionId === req.params.id);
  if (!disruption) {
    return res.status(404).json(errorResponse('DISRUPTION_NOT_FOUND', `Disruption ${req.params.id} was not found.`, 404));
  }
  return res.status(200).json(successResponse({ disruption }, 'Disruption details retrieved.'));
});

app.post('/api/disruptions', (req, res) => {
  try {
    validateDisruption(req.body);
    const disruption = { ...req.body };
    disruptions.push(disruption);
    return res.status(201).json(successResponse({ disruption }, 'Disruption created successfully.', 201));
  } catch (error) {
    return res.status(error.statusCode || 400).json(errorResponse(error.code || DEFAULT_BAD_REQUEST, error.message || 'Invalid disruption payload.'));
  }
});

app.put('/api/disruptions/:id', (req, res) => {
  const index = disruptions.findIndex((item) => item.disruptionId === req.params.id);
  if (index === -1) {
    return res.status(404).json(errorResponse('DISRUPTION_NOT_FOUND', `Disruption ${req.params.id} was not found.`, 404));
  }
  try {
    validateDisruption(req.body);
  } catch (error) {
    return res.status(error.statusCode || 400).json(errorResponse(error.code || DEFAULT_BAD_REQUEST, error.message || 'Invalid disruption payload.'));
  }
  disruptions[index] = { ...disruptions[index], ...req.body };
  return res.status(200).json(successResponse({ disruption: disruptions[index] }, 'Disruption updated successfully.'));
});

app.delete('/api/disruptions/:id', (req, res) => {
  const index = disruptions.findIndex((item) => item.disruptionId === req.params.id);
  if (index === -1) {
    return res.status(404).json(errorResponse('DISRUPTION_NOT_FOUND', `Disruption ${req.params.id} was not found.`, 404));
  }
  const [deleted] = disruptions.splice(index, 1);
  return res.status(200).json(successResponse({ disruption: deleted }, 'Disruption deleted successfully.'));
});

app.get('/api/shipments/:id/risk', async (req, res) => {
  try {
    if (isDbConnected()) {
      const shipmentDoc = await ShipmentModel.findOne({ shipmentId: req.params.id }).lean();
      if (shipmentDoc) {
        const riskScore = shipmentDoc.lateDeliveryRisk === 1 ? 85 : 20;
        const riskLevel = shipmentDoc.lateDeliveryRisk === 1 ? 'HIGH' : 'LOW';
        return res.status(200).json(successResponse({
          shipmentId: shipmentDoc.shipmentId,
          riskScore,
          riskLevel,
          reasons: [
            `Delivery status: ${shipmentDoc.deliveryStatusDataCo}`,
            `Late delivery risk indicator: ${shipmentDoc.lateDeliveryRisk}`,
            `Shipping mode: ${shipmentDoc.shippingMode}`
          ]
        }, 'Risk assessment generated from DataCo record.'));
      }
    }

    const item = assessRisk(req.params.id);
    if (!item) {
      return res.status(404).json(errorResponse('SHIPMENT_NOT_FOUND', `Shipment ${req.params.id} was not found.`, 404));
    }
    return res.status(200).json(successResponse(item, 'Risk assessment generated successfully.'));
  } catch (err) {
    return res.status(500).json(errorResponse('SERVER_ERROR', err.message, 500));
  }
});

app.post('/api/routes/recommend', (req, res) => {
  try {
    validateRouteRecommendation(req.body);
    const result = recommendRoute(req.body);
    return res.status(200).json(successResponse(result, 'Route recommendation generated.'));
  } catch (error) {
    return res.status(error.statusCode || 400).json(errorResponse(error.code || DEFAULT_BAD_REQUEST, error.message || 'Unable to generate route recommendation.'));
  }
});

app.post('/api/carriers/recommend', (req, res) => {
  try {
    validateCarrierRecommendation(req.body);
    const result = recommendCarrier(req.body);
    return res.status(200).json(successResponse(result, 'Carrier recommendation generated.'));
  } catch (error) {
    return res.status(error.statusCode || 400).json(errorResponse(error.code || DEFAULT_BAD_REQUEST, error.message || 'Unable to generate carrier recommendation.'));
  }
});

app.use('/api/ai', aiRoutes);
app.use('/api/bob', bobRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/cold-chain', coldChainRoutes);

app.use((req, res) => {
  res.status(404).json(errorResponse('NOT_FOUND', 'The requested endpoint was not found.', 404));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected server error occurred.'));
});

module.exports = app;
