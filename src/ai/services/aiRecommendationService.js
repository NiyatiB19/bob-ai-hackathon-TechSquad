/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * aiRecommendationService.js
 *
 * Orchestration service for Module C AI intelligence.
 * Handles analysis requests for POST /api/ai/analyze.
 */

import { generateRecommendation } from '../recommenders/recommendationEngine.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mockDataPath = join(__dirname, '../mock/mockData.json');
const mockData = JSON.parse(readFileSync(mockDataPath, 'utf8'));

/**
 * Analyzes shipment operational data and generates a complete AI decision support package.
 *
 * @param {Object} params
 * @param {string} [params.shipmentId] - Target shipment ID
 * @param {Object} [params.shipment] - Custom shipment object
 * @param {Object} [params.customContext] - Optional custom data context
 * @returns {Object} Complete analysis payload
 */
export async function analyzeShipment({ shipmentId, shipment, customContext } = {}) {
  const context = customContext || mockData;

  const shipments = context.shipments || [];
  const disruptions = context.disruptions || [];
  const routes = context.routes || [];
  const fleetAssets = context.fleetAssets || context.fleet || [];
  const coldChainReadings = context.temperatureReadings || [];

  // Determine target shipment
  let targetShipment = shipment;
  if (!targetShipment && shipmentId) {
    targetShipment = shipments.find((s) => s.shipmentId === shipmentId);
  }
  if (!targetShipment) {
    targetShipment = shipments[0] || null;
  }

  if (!targetShipment) {
    throw new Error('No valid shipment found for analysis.');
  }

  // Identify linked records
  const disruption = disruptions.find((d) => d.disruptionId === targetShipment.disruptionId || (d.location && String(d.location).toLowerCase() === String(targetShipment.currentLocation).toLowerCase()));
  const currentRoute = routes.find((r) => r.routeId === targetShipment.routeId);
  const coldChainTelemetry = coldChainReadings.find((r) => r.shipmentId === targetShipment.shipmentId);

  // Generate comprehensive recommendation package
  const recommendationPackage = generateRecommendation({
    shipment: targetShipment,
    disruption,
    currentRoute,
    availableRoutes: routes,
    fleetAssets,
    coldChainTelemetry
  });

  return {
    shipmentId: targetShipment.shipmentId,
    trackingNumber: targetShipment.trackingNumber || 'TRK-UNKNOWN',
    cargoType: targetShipment.cargoType || 'Standard Cargo',
    priority: targetShipment.priority || 'medium',
    recommendation: recommendationPackage
  };
}
