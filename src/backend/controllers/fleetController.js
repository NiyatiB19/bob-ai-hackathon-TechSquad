/**
 * SupplyGuard AI — Fleet Controller
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

const {
  getFleetAssets,
  getFleetAssetById,
  getIdleFleetAssets,
  getFleetUtilisation,
  recommendFleetRedeployment,
  redeployFleetAsset
} = require('../services/fleetService');
const { successResponse, errorResponse } = require('../utils/response');

function handleGetFleetAssets(req, res) {
  try {
    const assets = getFleetAssets(req.query);
    return res.status(200).json(successResponse({ assets, totalCount: assets.length }, 'Fleet assets retrieved successfully.'));
  } catch (error) {
    return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
}

function handleGetFleetAssetById(req, res) {
  try {
    const asset = getFleetAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json(errorResponse('FLEET_ASSET_NOT_FOUND', `Fleet asset ${req.params.id} was not found.`, 404));
    }
    return res.status(200).json(successResponse({ asset }, 'Fleet asset details retrieved successfully.'));
  } catch (error) {
    return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
}

function handleGetIdleFleet(req, res) {
  try {
    const assets = getIdleFleetAssets();
    return res.status(200).json(successResponse({ assets, idleCount: assets.length }, 'Idle fleet assets retrieved.'));
  } catch (error) {
    return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
}

function handleGetFleetUtilisation(req, res) {
  try {
    const utilisation = getFleetUtilisation();
    return res.status(200).json(successResponse(utilisation, 'Fleet utilisation score generated successfully.'));
  } catch (error) {
    return res.status(500).json(errorResponse('INTERNAL_SERVER_ERROR', error.message));
  }
}

function handleRecommendFleetRedeployment(req, res) {
  try {
    if (!req.body.shipmentId) {
      return res.status(400).json(errorResponse('VALIDATION_ERROR', 'shipmentId is required in request body.'));
    }
    const recommendation = recommendFleetRedeployment(req.body);
    return res.status(200).json(successResponse(recommendation, 'Fleet redeployment recommendation generated.'));
  } catch (error) {
    return res.status(400).json(errorResponse('REDEPLOYMENT_ERROR', error.message));
  }
}

function handleRedeployFleetAsset(req, res) {
  try {
    if (!req.body.shipmentId || !req.body.fleetAssetId) {
      return res.status(400).json(errorResponse('VALIDATION_ERROR', 'shipmentId and fleetAssetId are required in request body.'));
    }
    const result = redeployFleetAsset(req.body);
    return res.status(200).json(successResponse(result, 'Fleet asset redeployed successfully.'));
  } catch (error) {
    return res.status(400).json(errorResponse('REDEPLOYMENT_FAILED', error.message));
  }
}

module.exports = {
  handleGetFleetAssets,
  handleGetFleetAssetById,
  handleGetIdleFleet,
  handleGetFleetUtilisation,
  handleRecommendFleetRedeployment,
  handleRedeployFleetAsset
};
