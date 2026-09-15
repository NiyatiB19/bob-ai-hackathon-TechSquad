/**
 * SupplyGuard AI — Fleet Routes
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

const express = require('express');
const router = express.Router();
const {
  handleGetFleetAssets,
  handleGetFleetAssetById,
  handleGetIdleFleet,
  handleGetFleetUtilisation,
  handleRecommendFleetRedeployment,
  handleRedeployFleetAsset
} = require('../controllers/fleetController');

router.get('/', handleGetFleetAssets);
router.get('/idle', handleGetIdleFleet);
router.get('/utilisation', handleGetFleetUtilisation);
router.get('/recommendations', handleRecommendFleetRedeployment);
router.post('/recommend', handleRecommendFleetRedeployment);
router.post('/redeploy', handleRedeployFleetAsset);
router.get('/:id', handleGetFleetAssetById);

module.exports = router;
