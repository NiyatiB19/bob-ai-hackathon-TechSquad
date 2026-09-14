const { SEVERITY_WEIGHT, PRIORITY_WEIGHT } = require('../config/constants');
const { shipments, disruptions } = require('../mock/sampleData');

function normalizeText(value = '') {
  return String(value || '').toLowerCase().trim();
}

function overlaps(a, b) {
  if (!a || !b) return false;
  return normalizeText(a).includes(normalizeText(b)) || normalizeText(b).includes(normalizeText(a));
}

function isActiveDisruption(disruption) {
  return disruption && disruption.status === 'active';
}

function inTimeWindow(item, disruption) {
  if (!item || !disruption || !disruption.startTime || !disruption.expectedEndTime) {
    return true;
  }

  const itemDate = new Date(item.estimatedDeparture || item.estimatedArrival || Date.now()).getTime();
  const start = new Date(disruption.startTime).getTime();
  const end = new Date(disruption.expectedEndTime).getTime();

  return itemDate >= start && itemDate <= end;
}

function isShipmentAffected(shipment, disruption) {
  if (!shipment || !disruption || !isActiveDisruption(disruption)) {
    return { affected: false, riskLevel: 'LOW', reason: 'No active disruption affecting this shipment.', disruptionId: null };
  }

  const routeName = normalizeText(shipment.route && shipment.route.name);
  const origin = normalizeText(shipment.origin && shipment.origin.city);
  const destination = normalizeText(shipment.destination && shipment.destination.city);
  const location = normalizeText(shipment.currentLocation && (shipment.currentLocation.city || shipment.currentLocation.port || shipment.currentLocation.region));
  const disruptionLocations = [
    disruption.location && disruption.location.city,
    disruption.location && disruption.location.region,
    ...(disruption.affectedLocations || []),
  ].filter(Boolean);

  const matchedLocation = disruptionLocations.some((value) => {
    const n = normalizeText(value);
    return overlaps(origin, n) || overlaps(destination, n) || overlaps(location, n) || overlaps(routeName, n);
  });

  const matchedRoute = (disruption.affectedRoutes || []).some((route) => {
    const routeKey = normalizeText(route);
    return overlaps(routeKey, routeName) || overlaps(routeKey, origin) || overlaps(routeKey, destination);
  });

  const timeMatch = inTimeWindow(shipment, disruption);
  const affected = (matchedLocation || matchedRoute) && timeMatch;

  if (!affected) {
    return { affected: false, riskLevel: 'LOW', reason: 'No active matching disruption was found for this shipment route or location.', disruptionId: disruption.disruptionId };
  }

  const severityWeight = SEVERITY_WEIGHT[disruption.severity] || 10;
  const priorityWeight = PRIORITY_WEIGHT[shipment.priority] || 5;
  const riskScore = Math.min(100, severityWeight + priorityWeight + (shipment.temperatureSensitive ? 10 : 0));

  let riskLevel = 'LOW';
  if (riskScore >= 75) riskLevel = 'HIGH';
  else if (riskScore >= 45) riskLevel = 'MEDIUM';

  return {
    affected: true,
    riskLevel,
    reason: matchedLocation
      ? `${shipment.shipmentId} route or location overlaps with the affected ${disruption.name || disruption.title} area.`
      : `${shipment.shipmentId} route passes through a disruption-affected corridor for ${disruption.name || disruption.title}.`,
    disruptionId: disruption.disruptionId,
    riskScore,
  };
}

function getAffectedShipments() {
  const result = [];
  shipments.forEach((shipment) => {
    const matches = disruptions
      .filter((disruption) => isShipmentAffected(shipment, disruption).affected)
      .map((disruption) => ({
        shipmentId: shipment.shipmentId,
        affected: true,
        riskLevel: isShipmentAffected(shipment, disruption).riskLevel,
        riskScore: isShipmentAffected(shipment, disruption).riskScore,
        reason: isShipmentAffected(shipment, disruption).reason,
        disruptionId: disruption.disruptionId,
      }));

    if (matches.length > 0) {
      result.push(...matches);
    } else {
      result.push({
        shipmentId: shipment.shipmentId,
        affected: false,
        riskLevel: 'LOW',
        riskScore: 10,
        reason: 'No active disruption matches this shipment route or destination.',
        disruptionId: null,
      });
    }
  });

  return result;
}

module.exports = { isShipmentAffected, getAffectedShipments, inTimeWindow };
