/**
 * SupplyGuard AI — ColdChainSensor Model
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

class ColdChainSensor {
  constructor({
    sensorId,
    shipmentId,
    deviceModel = 'ThermoSense Pro IoT-X',
    batteryStatus = 100,
    targetTempMin = 2.0,
    targetTempMax = 8.0,
    isActive = true,
    createdAt = new Date().toISOString()
  }) {
    this.sensorId = sensorId;
    this.shipmentId = shipmentId;
    this.deviceModel = deviceModel;
    this.batteryStatus = batteryStatus;
    this.targetTempMin = targetTempMin;
    this.targetTempMax = targetTempMax;
    this.isActive = isActive;
    this.createdAt = createdAt;
  }

  static validate(data) {
    if (!data.sensorId || typeof data.sensorId !== 'string') {
      throw new Error('sensorId is required');
    }
    if (!data.shipmentId || typeof data.shipmentId !== 'string') {
      throw new Error('shipmentId is required');
    }
    if (typeof data.targetTempMin !== 'number' || typeof data.targetTempMax !== 'number') {
      throw new Error('targetTempMin and targetTempMax must be numbers');
    }
    if (data.targetTempMin >= data.targetTempMax) {
      throw new Error('targetTempMin must be less than targetTempMax');
    }
    return true;
  }
}

module.exports = ColdChainSensor;
