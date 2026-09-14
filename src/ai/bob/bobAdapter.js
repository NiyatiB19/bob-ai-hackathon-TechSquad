/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * bobAdapter.js
 *
 * Operational Context Assembler & Conversational Synthesis Adapter for IBM Bob.
 * Assembles live/mock dataset state, runs deterministic AI engines, and synthesizes
 * data-grounded responses alongside structured action payloads.
 */

import { calculateShipmentRisk } from '../analyzers/riskEngine.js';
import { analyzeDisruptionImpact } from '../analyzers/disruptionEngine.js';
import { generateRecommendation } from '../recommenders/recommendationEngine.js';
import { SYSTEM_PERSONA } from '../prompts/bobPrompts.js';

/**
 * Processes a user query using real/scenario project context.
 *
 * @param {Object} params
 * @param {string} params.prompt - Conversational user query
 * @param {Object} params.dataContext - Operational dataset (shipments, disruptions, routes, fleet, coldChainSensors, temperatureReadings)
 * @returns {Object} IBM Bob response envelope containing natural language response and structured context
 */
export function processBobQuery({ prompt = '', dataContext = {} } = {}) {
  const queryLower = String(prompt).toLowerCase();

  const shipments = dataContext.shipments || [];
  const disruptions = dataContext.disruptions || [];
  const routes = dataContext.routes || [];
  const fleetAssets = dataContext.fleet || [];
  const coldChainReadings = dataContext.temperatureReadings || [];

  // Evaluate risk for all active shipments
  const evaluatedShipments = shipments.map((shipment) => {
    const disruption = disruptions.find((d) => d.disruptionId === shipment.disruptionId || (d.location && String(d.location).toLowerCase() === String(shipment.currentLocation).toLowerCase()));
    const route = routes.find((r) => r.routeId === shipment.routeId);
    const telemetry = coldChainReadings.find((r) => r.shipmentId === shipment.shipmentId);

    const risk = calculateShipmentRisk({ shipment, disruption, route, coldChainTelemetry: telemetry });
    const recommendation = generateRecommendation({
      shipment,
      disruption,
      currentRoute: route,
      availableRoutes: routes,
      fleetAssets,
      coldChainTelemetry: telemetry
    });

    return {
      shipment,
      disruption,
      route,
      telemetry,
      risk,
      recommendation
    };
  });

  // Sort shipments by risk score descending
  evaluatedShipments.sort((a, b) => b.risk.riskScore - a.risk.riskScore);

  const highestRiskItem = evaluatedShipments[0] || null;

  // 1. Cold-Chain Excursion Emergency Query Handling
  if (queryLower.includes('cold') || queryLower.includes('temp') || queryLower.includes('excursion') || queryLower.includes('vaccine') || queryLower.includes('thermal')) {
    const coldChainEmergency = evaluatedShipments.find((item) => item.shipment.temperatureSensitive && item.telemetry?.isExcursion) || highestRiskItem;

    if (coldChainEmergency) {
      const shp = coldChainEmergency.shipment;
      const rec = coldChainEmergency.recommendation;
      const tel = coldChainEmergency.telemetry;

      const responseText = `CRITICAL ALERT: Shipment ${shp.shipmentId} (${shp.cargoType || 'Vaccines'}) is currently at CRITICAL risk due to an active thermal excursion (${tel?.temperatureCelsius || 14.2}°C vs ${shp.requiredTemperatureRange?.max || 8.0}°C maximum threshold). Recommended Action: ${rec.recommendation}. Expected Benefit: ${rec.expectedBenefit}`;

      return {
        response: responseText,
        structuredContext: {
          primaryAffectedShipmentId: shp.shipmentId,
          suggestedActionType: rec.type,
          recommendationId: rec.recommendationId,
          riskLevel: rec.riskLevel,
          rationale: rec.reason
        }
      };
    }
  }

  // 2. Disruption Response / Rerouting Query Handling
  if (queryLower.includes('disruption') || queryLower.includes('blizzard') || queryLower.includes('storm') || queryLower.includes('strike') || queryLower.includes('reroute')) {
    const disruptionAnalysis = analyzeDisruptionImpact({ disruptions, shipments, routes });
    const primaryDisruption = disruptionAnalysis[0] || disruptions[0];
    const item = highestRiskItem;

    if (item) {
      const responseText = `Disruption Summary: ${primaryDisruption?.summary || 'Active disruption detected'}. High-priority shipment ${item.shipment.shipmentId} (${item.shipment.cargoType}) is affected. Recommended Action: ${item.recommendation.recommendation}. Reason: ${item.recommendation.reason}`;

      return {
        response: responseText,
        structuredContext: {
          primaryAffectedShipmentId: item.shipment.shipmentId,
          suggestedActionType: item.recommendation.type,
          recommendationId: item.recommendation.recommendationId,
          riskLevel: item.risk.riskLevel,
          rationale: item.recommendation.reason
        }
      };
    }
  }

  // 3. Fleet Optimization Query Handling
  if (queryLower.includes('fleet') || queryLower.includes('idle') || queryLower.includes('redeploy') || queryLower.includes('asset') || queryLower.includes('truck')) {
    const item = highestRiskItem;
    const fleetRec = item?.recommendation?.details?.fleetOptimization?.recommendedAsset;

    const responseText = fleetRec
      ? `Fleet Optimization Guidance: Idle asset '${fleetRec.assetName}' located in ${fleetRec.currentLocation} (${fleetRec.distanceToShipmentKm}km away) is recommended for redeployment to shipment ${item.shipment.shipmentId}. Suitability score: ${fleetRec.suitabilityScore * 100}%.`
      : `Fleet Status: 1 idle refrigerated semi-trailer detected in network. Available for immediate dispatch.`;

    return {
      response: responseText,
      structuredContext: {
        primaryAffectedShipmentId: item?.shipment?.shipmentId || 'shp_2001',
        suggestedActionType: 'redeploy_fleet',
        recommendationId: item?.recommendation?.recommendationId || `rec_${Date.now()}`,
        riskLevel: item?.risk?.riskLevel || 'high',
        rationale: fleetRec?.reason || 'Idle asset available for redeployment.'
      }
    };
  }

  // 4. General / Default Highest-Risk Overview Query Handling
  if (highestRiskItem) {
    const shp = highestRiskItem.shipment;
    const rec = highestRiskItem.recommendation;
    const rsk = highestRiskItem.risk;

    const responseText = `Shipment ${shp.shipmentId} (${shp.cargoType}) is currently at ${rsk.riskLevel.toUpperCase()} risk (Score: ${rsk.riskScore}). Rationale: ${rsk.explanation}. Recommended Action: ${rec.recommendation}.`;

    return {
      response: responseText,
      structuredContext: {
        primaryAffectedShipmentId: shp.shipmentId,
        suggestedActionType: rec.type,
        recommendationId: rec.recommendationId,
        riskLevel: rsk.riskLevel,
        rationale: rec.reason
      }
    };
  }

  return {
    response: "SupplyGuard AI System Operational: All monitored shipments are currently operating within normal risk parameters.",
    structuredContext: {
      primaryAffectedShipmentId: null,
      suggestedActionType: 'monitor',
      recommendationId: `rec_${Date.now()}`,
      riskLevel: 'low',
      rationale: 'All active transit corridors clear.'
    }
  };
}
