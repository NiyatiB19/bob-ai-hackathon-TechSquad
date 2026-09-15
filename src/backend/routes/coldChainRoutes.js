/**
 * SupplyGuard AI — Cold Chain Routes
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

const express = require('express');
const router = express.Router();
const {
  handleGetColdChainOverview,
  handleGetShipmentTelemetry,
  handleProcessTelemetryReading,
  handleGetColdChainAlerts,
  handleAcknowledgeAlert
} = require('../controllers/coldChainController');

router.get('/', handleGetColdChainOverview);
router.get('/alerts', handleGetColdChainAlerts);
router.post('/telemetry', handleProcessTelemetryReading);
router.post('/analyze', handleProcessTelemetryReading);
router.post('/acknowledge', handleAcknowledgeAlert);
router.post('/acknowledge/:alertId', handleAcknowledgeAlert);
router.get('/:shipmentId', handleGetShipmentTelemetry);
router.get('/:shipmentId/history', handleGetShipmentTelemetry);

module.exports = router;
