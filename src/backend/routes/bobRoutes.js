/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * bobRoutes.js
 *
 * Express Router definition for IBM Bob decision support endpoints.
 */

const { Router } = require('express');
const { handleBobQuery } = require('../controllers/bobController');

const router = Router();

router.post('/query', handleBobQuery);
router.post('/ask', handleBobQuery);

module.exports = router;
