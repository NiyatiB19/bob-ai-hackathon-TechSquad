/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * fleetOptimizer.js
 *
 * Fleet redeployment optimization engine.
 * Matches idle fleet assets from Module D with stranded/affected shipments requiring transport capacity.
 */

/**
 * Recommends idle fleet asset redeployments for a given shipment requirement.
 *
 * @param {Object} params
 * @param {Object} params.shipment - Affected shipment record (Module B contract)
 * @param {Array} [params.fleetAssets=[]] - Registered fleet assets (Module D contract)
 * @returns {Object} Fleet redeployment recommendation payload
 */
export function optimizeFleetRedeployment(params = {}) {
  const { shipment, fleetAssets = [] } = params || {};
  if (!shipment) {
    return {
      recommendedAsset: null,
      candidateAssets: [],
      reason: 'No shipment provided for fleet optimization.',
      confidenceScore: 0.0
    };
  }

  const shipmentLocation = String(shipment.currentLocation || shipment.origin || '').toLowerCase();
  const requiresRefrigeration = Boolean(shipment.temperatureSensitive);

  // Filter candidate fleet assets that are idle
  const idleAssets = fleetAssets.filter((asset) => asset.status === 'idle');

  if (idleAssets.length === 0) {
    return {
      shipmentId: shipment.shipmentId,
      recommendedAsset: null,
      candidateAssets: [],
      reason: 'No idle fleet assets currently available in the network for redeployment.',
      confidenceScore: 0.10
    };
  }

  // Score suitability for each idle asset
  const scoredAssets = idleAssets.map((asset) => {
    let suitabilityScore = 0.50; // Base score for being idle
    const assetLocation = String(asset.currentLocation || '').toLowerCase();

    // 1. Refrigeration / Cold-Chain Compatibility Check
    const isRefrigeratedAsset =
      asset.transportMode === 'refrigerated_truck' ||
      asset.capacity?.refrigerated === true ||
      String(asset.assetName || '').toLowerCase().includes('reefer') ||
      String(asset.assetName || '').toLowerCase().includes('cold');

    if (requiresRefrigeration) {
      if (isRefrigeratedAsset) {
        suitabilityScore += 0.30;
      } else {
        suitabilityScore -= 0.40; // Incompatible thermal capability penalty
      }
    } else if (isRefrigeratedAsset) {
      suitabilityScore += 0.05; // Flexible asset
    }

    // 2. Geographic Proximity & Location Match
    const isLocationMatch =
      assetLocation && shipmentLocation &&
      (assetLocation.includes(shipmentLocation) || shipmentLocation.includes(assetLocation));

    let distanceToShipmentKm = 100.0;
    if (isLocationMatch) {
      suitabilityScore += 0.20;
      distanceToShipmentKm = 15.0; // Same city/hub approximation
    } else {
      distanceToShipmentKm = 85.0;
    }

    // Bound suitability score strictly between 0.0 and 1.0
    const finalScore = parseFloat(Math.min(1.0, Math.max(0.0, suitabilityScore)).toFixed(2));

    return {
      fleetAssetId: asset.fleetAssetId,
      assetName: asset.assetName || `Asset ${asset.fleetAssetId}`,
      transportMode: asset.transportMode || 'truck',
      capacity: asset.capacity || 20,
      currentLocation: asset.currentLocation || 'Unknown Hub',
      status: asset.status,
      isRefrigerated: isRefrigeratedAsset,
      distanceToShipmentKm,
      estimatedDeploymentTimeHours: parseFloat((distanceToShipmentKm / 40.0).toFixed(1)),
      suitabilityScore: finalScore
    };
  });

  // Filter out completely unsuitable candidates (score < 0.30)
  const validCandidates = scoredAssets.filter((a) => a.suitabilityScore >= 0.30);

  // Sort by highest suitability score first, then by shortest deployment time
  validCandidates.sort((a, b) => {
    if (b.suitabilityScore !== a.suitabilityScore) {
      return b.suitabilityScore - a.suitabilityScore;
    }
    return a.estimatedDeploymentTimeHours - b.estimatedDeploymentTimeHours;
  });

  if (validCandidates.length === 0) {
    return {
      shipmentId: shipment.shipmentId,
      recommendedAsset: null,
      candidateAssets: [],
      reason: `No cold-chain compatible idle assets found near location '${shipment.currentLocation || 'current location'}'.`,
      confidenceScore: 0.20
    };
  }

  const bestAsset = validCandidates[0];
  const reason = `Idle asset '${bestAsset.assetName}' (${bestAsset.currentLocation}) selected with ${bestAsset.suitabilityScore * 100}% suitability score. Distance to shipment: ${bestAsset.distanceToShipmentKm}km (est. ${bestAsset.estimatedDeploymentTimeHours}h deployment).`;

  return {
    shipmentId: shipment.shipmentId,
    recommendedAsset: bestAsset,
    candidateAssets: validCandidates,
    reason,
    confidenceScore: bestAsset.suitabilityScore >= 0.8 ? 0.92 : 0.70
  };
}
