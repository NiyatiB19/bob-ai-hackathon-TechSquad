/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * disruptionEngine.js
 *
 * Intelligence analyzer mapping disruption events to affected shipments, routes, and regions.
 * Consumes Module B disruption contracts without taking ownership of underlying data ingestion.
 */

/**
 * Analyzes active disruptions against shipments and route corridors.
 *
 * @param {Object} params
 * @param {Array} params.disruptions - Array of disruption records (Module B contract)
 * @param {Array} params.shipments - Array of active shipment records (Module B contract)
 * @param {Array} params.routes - Array of route corridor records (Module B contract)
 * @returns {Array} List of disruption impact intelligence objects
 */
export function analyzeDisruptionImpact({ disruptions = [], shipments = [], routes = [] } = {}) {
  if (!Array.isArray(disruptions) || disruptions.length === 0) {
    return [];
  }

  return disruptions.map((disruption) => {
    const disruptionId = disruption.disruptionId;
    const disruptionLocation = String(disruption.location || '').toLowerCase();
    const affectedArea = String(disruption.affectedArea || '').toLowerCase();

    // 1. Identify directly linked or location-coincident shipments
    const affectedShipments = shipments.filter((shipment) => {
      if (shipment.disruptionId === disruptionId) {
        return true;
      }
      const currentLocation = String(shipment.currentLocation || '').toLowerCase();
      const origin = String(shipment.origin || '').toLowerCase();
      const destination = String(shipment.destination || '').toLowerCase();

      return (
        (currentLocation && (disruptionLocation.includes(currentLocation) || affectedArea.includes(currentLocation))) ||
        (origin && (disruptionLocation.includes(origin) || affectedArea.includes(origin))) ||
        (destination && (disruptionLocation.includes(destination) || affectedArea.includes(destination)))
      );
    });

    // 2. Identify affected routes passing through or intersecting disruption zone
    const affectedRoutes = routes.filter((route) => {
      if (route.availability === false) {
        return true; // Unavailable routes are considered impacted
      }
      const routeWaypoints = Array.isArray(route.waypoints)
        ? route.waypoints.map((w) => String(w).toLowerCase())
        : [];
      return routeWaypoints.some(
        (wp) => disruptionLocation.includes(wp) || affectedArea.includes(wp)
      );
    });

    const affectedShipmentIds = affectedShipments.map((s) => s.shipmentId);
    const affectedRouteIds = affectedRoutes.map((r) => r.routeId);

    const impactSeverity = disruption.severity || (affectedShipments.length > 1 ? 'high' : 'medium');
    const summary = `Disruption '${disruption.title || disruptionId}' (${impactSeverity}) impacts ${affectedShipmentIds.length} active shipment(s) and ${affectedRouteIds.length} corridor(s). Location: ${disruption.location || 'Unknown'}.`;

    return {
      disruptionId,
      title: disruption.title || 'Active Disruption',
      type: disruption.type || 'unknown',
      severity: impactSeverity,
      location: disruption.location || null,
      affectedArea: disruption.affectedArea || null,
      affectedShipmentIds,
      affectedRouteIds,
      affectedShipmentsCount: affectedShipmentIds.length,
      affectedRoutesCount: affectedRouteIds.length,
      summary
    };
  });
}
