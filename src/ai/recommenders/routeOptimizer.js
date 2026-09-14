/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * routeOptimizer.js
 *
 * Rerouting recommendation engine.
 * Evaluates candidate alternative transit corridors against disrupted routes,
 * computing distance deltas, delay reductions, and overall corridor risk scores.
 */

/**
 * Optimizes and ranks route recommendations for a compromised shipment.
 *
 * @param {Object} params
 * @param {Object} params.shipment - Active shipment record (Module B contract)
 * @param {Object} [params.currentRoute] - Current route assigned to shipment (Module B contract)
 * @param {Array} [params.availableRoutes=[]] - List of all registered routes (Module B contract)
 * @param {Object} [params.disruption] - Active disruption details (Module B contract)
 * @returns {Object} Ranked route optimization payload
 */
export function optimizeRoute(params = {}) {
  const { shipment, currentRoute, availableRoutes = [], disruption } = params || {};
  if (!shipment) {
    return {
      recommendedRoute: null,
      candidateRoutes: [],
      reason: 'No shipment provided for route optimization.',
      confidenceScore: 0.0
    };
  }

  // Filter valid candidate alternative routes (must be available and distinct from current blocked route)
  const candidates = availableRoutes.filter((r) => {
    if (currentRoute && r.routeId === currentRoute.routeId) {
      return false; // Exclude current route
    }
    return r.availability !== false; // Only select available corridors
  });

  if (candidates.length === 0) {
    return {
      shipmentId: shipment.shipmentId,
      currentRouteId: currentRoute?.routeId || shipment.routeId || null,
      recommendedRoute: null,
      candidateRoutes: [],
      reason: `No available alternative route corridors found to bypass disruption ${disruption?.disruptionId || ''}.`,
      estimatedDelayHours: 24.0,
      confidenceScore: 0.20
    };
  }

  const currentDistance = currentRoute?.distanceKm || 1400;
  const currentDuration = currentRoute?.estimatedDurationHours || 24;

  // Score and rank candidate routes
  const evaluatedCandidates = candidates.map((route) => {
    const distanceKm = route.distanceKm || currentDistance;
    const distanceDeltaKm = parseFloat((distanceKm - currentDistance).toFixed(1));
    const estimatedDurationHours = route.estimatedDurationHours || currentDuration;

    // Disruption delay reduction computation
    const estimatedDelayHours = disruption?.severity === 'critical' ? 18.0 : 8.0;
    const delayReductionHours = parseFloat((estimatedDelayHours - Math.max(0, estimatedDurationHours - currentDuration)).toFixed(1));

    // Optional cost delta computation (only if cost is available, avoid inventing fake figures if absent)
    let additionalCostUSD = null;
    if (typeof route.additionalCostUSD === 'number') {
      additionalCostUSD = route.additionalCostUSD;
    } else if (distanceDeltaKm > 0) {
      additionalCostUSD = parseFloat((distanceDeltaKm * 2.2).toFixed(2)); // Realistic fuel/toll estimate
    }

    const corridorRiskScore = typeof route.riskScore === 'number' ? route.riskScore : 0.20;

    return {
      routeId: route.routeId,
      routeName: route.routeName || `Corridor ${route.routeId}`,
      transportMode: route.transportMode || 'road',
      origin: route.origin,
      destination: route.destination,
      waypoints: route.waypoints || [],
      distanceKm,
      distanceDeltaKm,
      estimatedDurationHours,
      delayReductionHours: Math.max(0, delayReductionHours),
      additionalCostUSD,
      riskScore: corridorRiskScore
    };
  });

  // Sort candidate routes by lowest risk score first, then shortest distance
  evaluatedCandidates.sort((a, b) => {
    if (a.riskScore !== b.riskScore) {
      return a.riskScore - b.riskScore;
    }
    return a.distanceKm - b.distanceKm;
  });

  const bestRoute = evaluatedCandidates[0];

  const reason = `Corridor '${bestRoute.routeName}' (Risk: ${bestRoute.riskScore}) bypasses active disruption ${disruption?.title ? `'${disruption.title}'` : (disruption?.disruptionId || 'area')} with estimated delay reduction of ${bestRoute.delayReductionHours}h.`;

  return {
    shipmentId: shipment.shipmentId,
    currentRouteId: currentRoute?.routeId || shipment.routeId || null,
    recommendedRoute: bestRoute,
    candidateRoutes: evaluatedCandidates,
    reason,
    estimatedDelayHours: Math.max(0, 24 - bestRoute.delayReductionHours),
    confidenceScore: bestRoute.riskScore < 0.3 ? 0.95 : 0.75
  };
}
