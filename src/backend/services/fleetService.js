/**
 * SupplyGuard AI — Fleet Service
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

const { fleetAssets, shipments } = require('../mock/sampleData');
const FleetAsset = require('../models/FleetAsset');
const FleetRecommendation = require('../models/FleetRecommendation');

/**
 * Calculates Euclidean distance between two lat/lng points in KM (approximate).
 */
function calculateDistanceKm(loc1, loc2) {
  if (!loc1 || !loc2 || loc1.lat === undefined || loc2.lat === undefined) return 50.0; // Default distance fallback
  const dLat = (loc2.lat - loc1.lat) * 111;
  const dLng = (loc2.lng - loc1.lng) * 111 * Math.cos((loc1.lat * Math.PI) / 180);
  return Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10;
}

/**
 * Retrieves list of fleet assets with optional filters.
 */
function getFleetAssets(query = {}) {
  let result = [...fleetAssets];

  if (query.status && query.status !== 'All') {
    const statusUpper = query.status.toUpperCase();
    result = result.filter(asset => asset.status.toUpperCase() === statusUpper);
  }

  if (query.transportMode && query.transportMode !== 'All') {
    const modeLower = query.transportMode.toLowerCase();
    result = result.filter(asset => asset.transportMode.toLowerCase() === modeLower || asset.type?.toLowerCase() === modeLower);
  }

  return result;
}

/**
 * Retrieves a single fleet asset by ID.
 */
function getFleetAssetById(id) {
  const asset = fleetAssets.find(a => a.fleetAssetId === id || a.id === id);
  return asset || null;
}

/**
 * Retrieves all currently idle fleet assets available for redeployment.
 */
function getIdleFleetAssets() {
  return fleetAssets.filter(asset => asset.status.toUpperCase() === 'IDLE');
}

/**
 * Calculates fleet utilisation statistics and operational status score.
 */
function getFleetUtilisation() {
  const totalAssets = fleetAssets.length;
  if (totalAssets === 0) {
    return {
      totalAssets: 0,
      activeAssets: 0,
      idleAssets: 0,
      maintenanceAssets: 0,
      averageUtilizationPercentage: 0,
      operationalStatus: 'Idle',
      summary: 'No fleet assets registered.'
    };
  }

  const activeAssets = fleetAssets.filter(a => ['ACTIVE', 'IN_TRANSIT', 'ASSIGNED'].includes(a.status.toUpperCase())).length;
  const idleAssets = fleetAssets.filter(a => a.status.toUpperCase() === 'IDLE').length;
  const maintenanceAssets = fleetAssets.filter(a => a.status.toUpperCase() === 'MAINTENANCE').length;

  const sumUtil = fleetAssets.reduce((acc, curr) => acc + (curr.utilizationPercentage || curr.utilization || 0), 0);
  const averageUtilizationPercentage = Math.round((sumUtil / totalAssets) * 10) / 10;

  let operationalStatus = 'Under Utilised';
  if (averageUtilizationPercentage >= 80) {
    operationalStatus = 'Fully Utilised';
  } else if (averageUtilizationPercentage >= 50) {
    operationalStatus = 'Partially Utilised';
  } else if (averageUtilizationPercentage > 0) {
    operationalStatus = 'Under Utilised';
  } else {
    operationalStatus = 'Idle';
  }

  return {
    totalAssets,
    activeAssets,
    idleAssets,
    maintenanceAssets,
    averageUtilizationPercentage,
    operationalStatus,
    summary: `${activeAssets} of ${totalAssets} assets active (${averageUtilizationPercentage}% avg utilization). ${idleAssets} idle assets available for redeployment.`
  };
}

/**
 * Evaluates idle fleet assets and generates a redeployment recommendation for a shipment.
 */
function recommendFleetRedeployment({ shipmentId, requiredCapacityKg, refrigeratedRequired }) {
  if (!shipmentId) {
    throw new Error('shipmentId is required');
  }

  const shipment = shipments.find(s => s.shipmentId === shipmentId || s.id === shipmentId);
  const isRefrigRequired = refrigeratedRequired !== undefined
    ? Boolean(refrigeratedRequired)
    : (shipment ? Boolean(shipment.temperatureSensitive) : false);

  const reqCapKg = requiredCapacityKg || (isRefrigRequired ? 10000 : 5000);

  const idleAssets = getIdleFleetAssets();

  if (idleAssets.length === 0) {
    return {
      shipmentId,
      recommendation: 'NONE_AVAILABLE',
      priority: 'HIGH',
      reason: ['No idle fleet assets currently available in system.'],
      recommendedAsset: null
    };
  }

  // Filter candidate assets
  const candidates = idleAssets.filter(asset => {
    const isRefrig = asset.capacity?.refrigerated || asset.assetName?.toLowerCase().includes('reefer') || asset.name?.toLowerCase().includes('reefer');
    if (isRefrigRequired && !isRefrig) return false;

    const maxCap = asset.capacity?.maxWeightKg || 20000;
    if (maxCap < reqCapKg) return false;

    return true;
  });

  if (candidates.length === 0) {
    return {
      shipmentId,
      recommendation: 'NO_COMPATIBLE_ASSET',
      priority: 'HIGH',
      reason: [
        'Fleet assets exist but none meet the required refrigeration or capacity constraints.',
        `Required capacity: ${reqCapKg} kg, Refrigerated required: ${isRefrigRequired}`
      ],
      recommendedAsset: null
    };
  }

  // Rank candidate by proximity to shipment location
  const shipmentLoc = shipment?.currentLocation || { city: 'Mumbai', lat: 19.0760, lng: 72.8777 };

  candidates.sort((a, b) => {
    const distA = calculateDistanceKm(a.currentLocation, shipmentLoc);
    const distB = calculateDistanceKm(b.currentLocation, shipmentLoc);
    return distA - distB;
  });

  const selectedAsset = candidates[0];
  const distKm = calculateDistanceKm(selectedAsset.currentLocation, shipmentLoc);
  const estDeploymentHours = Math.round((distKm / 60) * 10) / 10 || 1.0;

  const reasons = [
    `Fleet asset ${selectedAsset.fleetAssetId || selectedAsset.id} is idle and available`,
    `Located near shipment location (${selectedAsset.currentLocation?.city || 'Origin'} - approx ${distKm} km)`,
    `Capacity (${selectedAsset.capacity?.maxWeightKg || 20000} kg) is sufficient for shipment requirements`
  ];
  if (isRefrigRequired) {
    reasons.push('Refrigeration unit is active and temperature compatible');
  }

  return new FleetRecommendation({
    recommendationId: `rec_flt_${Date.now()}`,
    shipmentId,
    fleetAssetId: selectedAsset.fleetAssetId || selectedAsset.id,
    recommendation: 'REDEPLOY',
    priority: shipment?.priority?.toUpperCase() || 'HIGH',
    reason: reasons,
    recommendedAsset: {
      fleetAssetId: selectedAsset.fleetAssetId || selectedAsset.id,
      assetName: selectedAsset.assetName || selectedAsset.name,
      transportMode: selectedAsset.transportMode || selectedAsset.type,
      currentLocation: selectedAsset.currentLocation || { city: selectedAsset.location },
      distanceToShipmentKm: distKm,
      estimatedDeploymentTimeHours: estDeploymentHours
    },
    confidence: 0.94
  });
}

/**
 * Executes a fleet redeployment command, updating asset status to ASSIGNED/IN_TRANSIT.
 */
function redeployFleetAsset({ shipmentId, fleetAssetId }) {
  if (!shipmentId || !fleetAssetId) {
    throw new Error('shipmentId and fleetAssetId are required for redeployment');
  }

  const assetIndex = fleetAssets.findIndex(a => a.fleetAssetId === fleetAssetId || a.id === fleetAssetId);
  if (assetIndex === -1) {
    throw new Error(`Fleet asset ${fleetAssetId} was not found.`);
  }

  const asset = fleetAssets[assetIndex];
  asset.status = 'ASSIGNED';
  asset.utilizationPercentage = 82;
  asset.assignedShipmentId = shipmentId;
  asset.lastUpdated = new Date().toISOString();

  // If shipment exists, link asset
  const shipment = shipments.find(s => s.shipmentId === shipmentId || s.id === shipmentId);
  if (shipment) {
    shipment.assignedFleetAssetId = fleetAssetId;
  }

  return {
    success: true,
    message: `Asset ${fleetAssetId} successfully redeployed to Shipment ${shipmentId}.`,
    asset
  };
}

module.exports = {
  getFleetAssets,
  getFleetAssetById,
  getIdleFleetAssets,
  getFleetUtilisation,
  recommendFleetRedeployment,
  redeployFleetAsset
};
