/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * riskEngine.js
 *
 * Deterministic and explainable shipment risk scoring engine.
 * Computes multi-factor risk based on disruption severity, route availability,
 * shipment priority, and cold-chain temperature excursion telemetry.
 */

/**
 * Calculates deterministic risk metrics for a given shipment and operational context.
 *
 * @param {Object} params
 * @param {Object} params.shipment - Shipment record (Module B contract)
 * @param {Object} [params.disruption] - Associated active disruption (Module B contract)
 * @param {Object} [params.route] - Current route record (Module B contract)
 * @param {Object} [params.coldChainTelemetry] - Temperature excursion details (Module D contract)
 * @returns {Object} Deterministic risk evaluation payload
 */
export function calculateShipmentRisk(params = {}) {
  const { shipment, disruption, route, coldChainTelemetry } = params || {};
  if (!shipment || typeof shipment !== 'object') {
    return {
      riskScore: 0.0,
      riskLevel: 'low',
      riskFactors: ['No valid shipment payload provided'],
      explanation: 'Unable to compute risk score due to missing shipment data.',
      recommendedAction: 'Verify shipment input data.'
    };
  }

  const riskFactors = [];
  let baseScore = 0.1; // Default baseline risk for normal transit

  // 1. Disruption Severity Impact
  if (disruption && disruption.status === 'active') {
    const severityMap = {
      critical: 0.40,
      high: 0.30,
      medium: 0.20,
      low: 0.10
    };
    const disruptionBoost = severityMap[disruption.severity] || 0.15;
    baseScore += disruptionBoost;
    riskFactors.push(`Active disruption '${disruption.title || disruption.disruptionId}' with ${disruption.severity || 'known'} severity (+${(disruptionBoost * 100).toFixed(0)}%)`);
  } else if (shipment.disruptionId) {
    baseScore += 0.25;
    riskFactors.push(`Shipment linked to active disruption ID: ${shipment.disruptionId} (+25%)`);
  }

  // 2. Route Risk & Availability Impact
  if (route) {
    if (route.availability === false) {
      baseScore += 0.25;
      riskFactors.push(`Primary route corridor '${route.routeName || route.routeId}' is blocked/unavailable (+25%)`);
    }
    if (typeof route.riskScore === 'number' && route.riskScore > 0) {
      const routeRiskContribution = route.riskScore * 0.20;
      baseScore += routeRiskContribution;
      riskFactors.push(`Route risk rating of ${route.riskScore.toFixed(2)} (+${(routeRiskContribution * 100).toFixed(0)}%)`);
    }
  }

  // 3. Shipment Priority Weighting
  const priorityMap = {
    critical: 0.20,
    high: 0.15,
    medium: 0.10,
    low: 0.05
  };
  const priorityBoost = priorityMap[shipment.priority] || 0.05;
  baseScore += priorityBoost;
  riskFactors.push(`Cargo priority '${shipment.priority || 'medium'}' (+${(priorityBoost * 100).toFixed(0)}%)`);

  // 4. Cold-Chain Excursion Impact (Module D interface)
  if (shipment.temperatureSensitive) {
    if (coldChainTelemetry && coldChainTelemetry.isExcursion) {
      const excursionBoost = coldChainTelemetry.severity === 'critical' ? 0.30 : 0.15;
      baseScore += excursionBoost;
      riskFactors.push(`Active temperature excursion detected (${coldChainTelemetry.temperatureCelsius}°C) with ${coldChainTelemetry.severity} severity (+${(excursionBoost * 100).toFixed(0)}%)`);
    } else {
      riskFactors.push('Temperature sensitive cargo monitored, thermal conditions normal');
    }
  }

  // 5. Shipment Delay / Stranded Status Impact
  if (shipment.status === 'delayed' || shipment.status === 'stranded') {
    baseScore += 0.15;
    riskFactors.push(`Shipment operational status is '${shipment.status}' (+15%)`);
  }

  // Bound score strictly between 0.00 and 1.00
  const riskScore = parseFloat(Math.min(1.0, Math.max(0.0, baseScore)).toFixed(2));

  // Determine Risk Level Thresholds
  let riskLevel = 'low';
  if (riskScore >= 0.75) {
    riskLevel = 'critical';
  } else if (riskScore >= 0.55) {
    riskLevel = 'high';
  } else if (riskScore >= 0.35) {
    riskLevel = 'medium';
  }

  // Construct Natural Language Rationale & Recommendation Action
  let explanation = '';
  let recommendedAction = '';

  switch (riskLevel) {
    case 'critical':
      explanation = `Shipment ${shipment.shipmentId} (${shipment.cargoType || 'Cargo'}) is at CRITICAL risk (Score: ${riskScore}). Multiple severe compounding risk factors detected, including active disruption exposure and/or cold-chain excursions.`;
      recommendedAction = shipment.temperatureSensitive && coldChainTelemetry?.isExcursion
        ? 'IMMEDIATE EMERGENCY INTERVENTION: Deploy nearest idle refrigerated asset and reroute via alternative corridor.'
        : 'IMMEDIATE ACTION: Initiate rerouting protocol to bypass primary disruption zone.';
      break;

    case 'high':
      explanation = `Shipment ${shipment.shipmentId} (${shipment.cargoType || 'Cargo'}) is at HIGH risk (Score: ${riskScore}) due to corridor availability constraints or high cargo priority.`;
      recommendedAction = 'EVALUATE ALTERNATIVES: Prepare alternative route dispatch and monitor telemetry.';
      break;

    case 'medium':
      explanation = `Shipment ${shipment.shipmentId} is at MEDIUM risk (Score: ${riskScore}). Operational monitoring advised.`;
      recommendedAction = 'MONITOR: Track status and maintain standard route schedule.';
      break;

    default:
      explanation = `Shipment ${shipment.shipmentId} is operating under LOW risk conditions (Score: ${riskScore}). No immediate intervention required.`;
      recommendedAction = 'CONTINUE: Proceed as scheduled.';
      break;
  }

  return {
    shipmentId: shipment.shipmentId,
    riskScore,
    riskLevel,
    riskFactors,
    explanation,
    recommendedAction
  };
}
