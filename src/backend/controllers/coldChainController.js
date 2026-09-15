/**
 * SupplyGuard AI — Cold Chain Controller
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

const {
  getColdChainOverview,
  getShipmentTelemetry,
  processTelemetryReading,
  getColdChainAlerts,
  acknowledgeColdChainAlert
} = require('../services/coldChainService');
const { successResponse, errorResponse } = require('../utils/response');

function handleGetColdChainOverview(req, res) {
  try {
    const overview = getColdChainOverview();
    return res.status(200).json(successResponse(overview, 'Cold-chain telemetry overview retrieved.'));
  } catch (error) {
    return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
}

function handleGetShipmentTelemetry(req, res) {
  try {
    const shipmentId = req.params.shipmentId;
    const telemetry = getShipmentTelemetry(shipmentId);
    return res.status(200).json(successResponse(telemetry, 'Shipment cold-chain telemetry retrieved successfully.'));
  } catch (error) {
    return res.status(404).json(errorResponse('TELEMETRY_NOT_FOUND', error.message, 404));
  }
}

function handleProcessTelemetryReading(req, res) {
  try {
    const { shipmentId, temperatureCelsius } = req.body;
    if (!shipmentId || temperatureCelsius === undefined || temperatureCelsius === null) {
      return res.status(400).json(errorResponse('VALIDATION_ERROR', 'shipmentId and temperatureCelsius are required.'));
    }
    const result = processTelemetryReading(req.body);
    return res.status(201).json(successResponse(result, 'Telemetry reading processed successfully.', 201));
  } catch (error) {
    return res.status(400).json(errorResponse('TELEMETRY_PROCESSING_ERROR', error.message));
  }
}

function handleGetColdChainAlerts(req, res) {
  try {
    const alerts = getColdChainAlerts();
    return res.status(200).json(successResponse({ alerts, totalCount: alerts.length }, 'Cold-chain alerts retrieved.'));
  } catch (error) {
    return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
}

function handleAcknowledgeAlert(req, res) {
  try {
    const alertId = req.params.alertId || req.body.alertId;
    if (!alertId) {
      return res.status(400).json(errorResponse('VALIDATION_ERROR', 'alertId is required.'));
    }
    const result = acknowledgeColdChainAlert(alertId);
    return res.status(200).json(successResponse(result, 'Cold-chain alert acknowledged successfully.'));
  } catch (error) {
    return res.status(404).json(errorResponse('ALERT_NOT_FOUND', error.message, 404));
  }
}

module.exports = {
  handleGetColdChainOverview,
  handleGetShipmentTelemetry,
  handleProcessTelemetryReading,
  handleGetColdChainAlerts,
  handleAcknowledgeAlert
};
