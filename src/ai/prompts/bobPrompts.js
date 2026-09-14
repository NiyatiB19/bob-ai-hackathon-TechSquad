/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * bobPrompts.js
 *
 * System persona and prompt template definitions for IBM Bob operational decision support.
 */

export const SYSTEM_PERSONA = `You are IBM Bob, an AI Supply Chain Disruption Assistant & Fleet Utilisation Optimizer.
Your job is to provide clear, actionable, data-grounded operational advice to logistics dispatchers and supply chain managers.
Always ground your answers in the exact project data provided (shipment IDs, temperatures, disruption details, route names, fleet asset locations).
Be concise, explainable, and prioritize high-risk/cold-chain critical situations first.`;

/**
 * Constructs prompt context for highest-risk shipment queries.
 *
 * @param {Array} highRiskShipments
 * @returns {string} Prompt text
 */
export function buildRiskSummaryPrompt(highRiskShipments = []) {
  const summaryList = highRiskShipments.map((s) => `- Shipment ${s.shipmentId} (${s.cargoType}): Risk Level ${s.riskLevel.toUpperCase()} (Score: ${s.riskScore}). ${s.explanation}`).join('\n');

  return `${SYSTEM_PERSONA}

Current Active High-Risk Shipments:
${summaryList || 'No high-risk shipments detected.'}

Please summarize the highest risk shipment requiring immediate intervention and explain the recommended action.`;
}

/**
 * Constructs prompt context for disruption response queries.
 *
 * @param {Object} disruption
 * @param {Array} affectedShipments
 * @returns {string} Prompt text
 */
export function buildDisruptionResponsePrompt(disruption, affectedShipments = []) {
  return `${SYSTEM_PERSONA}

Disruption Details:
- Title: ${disruption?.title || 'Unknown Disruption'}
- Severity: ${disruption?.severity || 'High'}
- Location: ${disruption?.location || 'Unspecified'}
- Impacted Shipments: ${affectedShipments.map((s) => s.shipmentId).join(', ') || 'None'}

Describe the optimal operational response, including rerouting and fleet redeployment steps.`;
}

/**
 * Constructs prompt context for cold-chain emergency queries.
 *
 * @param {Object} alert
 * @param {Object} shipment
 * @param {Object} recommendedFleet
 * @returns {string} Prompt text
 */
export function buildColdChainAlertPrompt(alert, shipment, recommendedFleet) {
  return `${SYSTEM_PERSONA}

Cold-Chain Alert:
- Shipment: ${shipment?.shipmentId} (${shipment?.cargoType})
- Current Sensor Reading: ${alert?.temperatureCelsius}°C (Allowed range: ${alert?.allowedMinTemp || 2}°C - ${alert?.allowedMaxTemp || 8}°C)
- Severity: ${alert?.severity?.toUpperCase()}
- Nearby Recommended Reefer: ${recommendedFleet?.assetName || 'Reefer T-408'} (${recommendedFleet?.currentLocation || 'Frankfurt'}, ${recommendedFleet?.distanceToShipmentKm || 45}km away)

Provide immediate emergency instructions for the dispatcher.`;
}
