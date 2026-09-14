/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * aiRoutes.js
 *
 * Express Router definition for AI analysis endpoints.
 */

const { Router } = require('express');
const { analyzeShipmentHandler } = require('../controllers/aiController');

const router = Router();

router.post('/analyze', analyzeShipmentHandler);

module.exports = router;
