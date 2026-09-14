const { shipments, routes } = require('../mock/sampleData');
const { isShipmentAffected } = require('./affectedShipmentService');
const { disruptions } = require('../mock/sampleData');

function recommendRoute({ shipmentId, currentRoute, alternativeRoutes = [] }) {
  const shipment = shipments.find((item) => item.shipmentId === shipmentId);
  if (!shipment) {
    throw new Error('Shipment not found');
  }

  const activeDisruptions = disruptions.filter((d) => d.status === 'active');

  const candidateRoutes = (alternativeRoutes.length ? alternativeRoutes : routes).filter((route) => {
    const routeName = route.name || route.routeId;
    const isAvailable = route.status === 'available' || route.availability === true;
    if (!isAvailable) return false;

    const exposed = activeDisruptions.some((disruption) => {
      const disruptionRisk = disruption.affectedRoutes || [];
      return disruptionRisk.some((affectedRoute) => affectedRoute.toLowerCase().includes(routeName.toLowerCase()) || routeName.toLowerCase().includes(affectedRoute.toLowerCase()));
    });
    return !exposed;
  });

  if (candidateRoutes.length === 0) {
    return {
      shipmentId: shipment.shipmentId,
      currentRoute,
      recommendedRoute: null,
      alternatives: [],
      reason: 'No safe alternative route is currently available.',
      risk: 'HIGH',
    };
  }

  const ranked = [...candidateRoutes].sort((a, b) => {
    const riskOrder = { LOW: 0, MEDIUM: 1, HIGH: 2 };
    const riskDiff = riskOrder[a.risk || 'LOW'] - riskOrder[b.risk || 'LOW'];
    if (riskDiff !== 0) return riskDiff;
    return (a.delayHours || 0) - (b.delayHours || 0);
  });

  const recommended = ranked[0];

  return {
    shipmentId: shipment.shipmentId,
    currentRoute: currentRoute || shipment.route.name,
    recommendedRoute: recommended,
    alternatives: ranked.slice(1),
    reason: `Lowest-risk available alternative (${recommended.risk}) with acceptable delay of ${recommended.delayHours || 0} hours.`,
    risk: recommended.risk || 'LOW',
  };
}

module.exports = { recommendRoute };
