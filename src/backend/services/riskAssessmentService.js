const { SEVERITY_WEIGHT, PRIORITY_WEIGHT } = require('../config/constants');
const { shipments, disruptions } = require('../mock/sampleData');
const { isShipmentAffected } = require('./affectedShipmentService');

function assessRisk(shipmentId) {
  const shipment = shipments.find((item) => item.shipmentId === shipmentId);
  if (!shipment) {
    return null;
  }

  const affectedMatch = disruptions
    .map((disruption) => ({ disruption, result: isShipmentAffected(shipment, disruption) }))
    .find((entry) => entry.result.affected);

  const activeImpact = affectedMatch ? affectedMatch.result : { riskLevel: 'LOW', riskScore: 10, reason: 'No active disruption affecting shipment.' };
  const severityScore = activeImpact.riskScore || 10;
  const priorityScore = PRIORITY_WEIGHT[shipment.priority] || 5;
  const cargoScore = shipment.temperatureSensitive ? 10 : 0;
  const routeRisk = shipment.route && shipment.route.risk ? { LOW: 10, MEDIUM: 30, HIGH: 50 }[shipment.route.risk] || 10 : 10;
  const score = Math.min(100, severityScore + priorityScore + cargoScore + routeRisk);

  let riskLevel = 'LOW';
  if (score >= 75) riskLevel = 'HIGH';
  else if (score >= 45) riskLevel = 'MEDIUM';

  const reasons = [];
  if (affectedMatch) {
    reasons.push(`Affected by ${affectedMatch.disruption.name || affectedMatch.disruption.title}`);
  }
  if (shipment.priority === 'critical' || shipment.priority === 'high') {
    reasons.push('High-priority shipment');
  }
  if (shipment.temperatureSensitive) {
    reasons.push('Temperature-sensitive cargo');
  }
  if (shipment.route && shipment.route.status === 'disrupted') {
    reasons.push('Current route is disrupted');
  }
  if (reasons.length === 0) {
    reasons.push('No active disruption or route risk identified');
  }

  return {
    shipmentId: shipment.shipmentId,
    affected: Boolean(affectedMatch),
    riskLevel,
    riskScore: score,
    reasons,
    disruptionId: affectedMatch ? affectedMatch.disruption.disruptionId : null,
  };
}

module.exports = { assessRisk };
