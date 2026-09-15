const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { shipments, disruptions, carriers } = require('./mock/sampleData');
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

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_BAD_REQUEST = 'VALIDATION_ERROR';

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
  res.json({ success: true, data: { status: 'ok' }, message: 'Backend is running.' });
});

app.get('/api/shipments', (req, res) => {
  res.status(200).json(successResponse({ shipments, totalCount: shipments.length }, 'Shipments retrieved successfully.'));
});

app.get('/api/shipments/affected', (req, res) => {
  const data = getAffectedShipments();
  res.status(200).json(successResponse({ shipments: data, totalCount: data.length }, 'Affected shipments analyzed successfully.'));
});

app.get('/api/shipments/:id', (req, res) => {
  const shipment = shipments.find((item) => item.shipmentId === req.params.id);
  if (!shipment) {
    return res.status(404).json(errorResponse('SHIPMENT_NOT_FOUND', `Shipment ${req.params.id} was not found.`, 404));
  }
  return res.status(200).json(successResponse({ shipment }, 'Shipment details retrieved successfully.'));
});

app.post('/api/shipments', (req, res) => {
  try {
    validateShipment(req.body);
    const shipment = { ...req.body };
    shipments.push(shipment);
    return res.status(201).json(successResponse({ shipment }, 'Shipment created successfully.', 201));
  } catch (error) {
    return res.status(error.statusCode || 400).json(errorResponse(error.code || DEFAULT_BAD_REQUEST, error.message || 'Invalid shipment payload.'));
  }
});

app.put('/api/shipments/:id', (req, res) => {
  const index = shipments.findIndex((item) => item.shipmentId === req.params.id);
  if (index === -1) {
    return res.status(404).json(errorResponse('SHIPMENT_NOT_FOUND', `Shipment ${req.params.id} was not found.`, 404));
  }
  try {
    validateShipment(req.body);
  } catch (error) {
    return res.status(error.statusCode || 400).json(errorResponse(error.code || DEFAULT_BAD_REQUEST, error.message || 'Invalid shipment payload.'));
  }
  shipments[index] = { ...shipments[index], ...req.body };
  return res.status(200).json(successResponse({ shipment: shipments[index] }, 'Shipment updated successfully.'));
});

app.delete('/api/shipments/:id', (req, res) => {
  const index = shipments.findIndex((item) => item.shipmentId === req.params.id);
  if (index === -1) {
    return res.status(404).json(errorResponse('SHIPMENT_NOT_FOUND', `Shipment ${req.params.id} was not found.`, 404));
  }
  const [deleted] = shipments.splice(index, 1);
  return res.status(200).json(successResponse({ shipment: deleted }, 'Shipment deleted successfully.'));
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

app.get('/api/shipments/:id/risk', (req, res) => {
  const item = assessRisk(req.params.id);
  if (!item) {
    return res.status(404).json(errorResponse('SHIPMENT_NOT_FOUND', `Shipment ${req.params.id} was not found.`, 404));
  }
  return res.status(200).json(successResponse(item, 'Risk assessment generated successfully.'));
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
