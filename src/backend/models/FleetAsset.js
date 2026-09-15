/**
 * SupplyGuard AI — FleetAsset Model
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

class FleetAsset {
  constructor({
    fleetAssetId,
    assetName,
    transportMode = 'truck', // truck, container, vessel, railcar
    capacity = { maxWeightKg: 20000, volumeM3: 60, refrigerated: false },
    currentLocation = { city: 'Unknown', country: 'Unknown', lat: 0, lng: 0 },
    status = 'idle', // available, active, in_transit, assigned, idle, maintenance, unavailable
    utilizationPercentage = 0,
    assignedShipmentId = null,
    driver = 'Standby Crew',
    lastUpdated = new Date().toISOString()
  }) {
    this.fleetAssetId = fleetAssetId;
    this.assetName = assetName;
    this.transportMode = transportMode;
    this.capacity = capacity;
    this.currentLocation = currentLocation;
    this.status = status;
    this.utilizationPercentage = utilizationPercentage;
    this.assignedShipmentId = assignedShipmentId;
    this.driver = driver;
    this.lastUpdated = lastUpdated;
  }

  static validate(data) {
    if (!data.fleetAssetId || typeof data.fleetAssetId !== 'string') {
      throw new Error('fleetAssetId is required and must be a string');
    }
    if (!data.assetName || typeof data.assetName !== 'string') {
      throw new Error('assetName is required and must be a string');
    }
    const validStatuses = ['available', 'active', 'in_transit', 'assigned', 'idle', 'maintenance', 'unavailable', 'Active', 'Idle', 'Maintenance'];
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error(`Invalid asset status: ${data.status}`);
    }
    return true;
  }
}

module.exports = FleetAsset;
