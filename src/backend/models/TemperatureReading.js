/**
 * SupplyGuard AI — TemperatureReading Model
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

class TemperatureReading {
  constructor({
    readingId,
    sensorId,
    shipmentId,
    timestamp = new Date().toISOString(),
    temperatureCelsius,
    allowedMinTemp = 2.0,
    allowedMaxTemp = 8.0,
    isExcursion = false,
    severity = 'normal', // normal, warning, critical
    location = null
  }) {
    this.readingId = readingId;
    this.sensorId = sensorId;
    this.shipmentId = shipmentId;
    this.timestamp = timestamp;
    this.temperatureCelsius = temperatureCelsius;
    this.allowedMinTemp = allowedMinTemp;
    this.allowedMaxTemp = allowedMaxTemp;
    this.isExcursion = isExcursion;
    this.severity = severity;
    this.location = location;
  }

  static validate(data) {
    if (!data.sensorId || !data.shipmentId) {
      throw new Error('sensorId and shipmentId are required');
    }
    if (typeof data.temperatureCelsius !== 'number' || Number.isNaN(data.temperatureCelsius)) {
      throw new Error('temperatureCelsius must be a valid number');
    }
    return true;
  }
}

module.exports = TemperatureReading;
