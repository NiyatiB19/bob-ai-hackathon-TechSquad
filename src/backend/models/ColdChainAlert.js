/**
 * SupplyGuard AI — ColdChainAlert Model
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

class ColdChainAlert {
  constructor({
    alertId,
    shipmentId,
    sensorId,
    readingId,
    temperatureCelsius,
    allowedMinTemp,
    allowedMaxTemp,
    severity = 'CRITICAL', // WARNING, CRITICAL
    durationMinutes = 0,
    startTime = new Date().toISOString(),
    status = 'ACTIVE', // ACTIVE, ACKNOWLEDGED, RESOLVED
    recommendedAction = 'Inspect shipment and move to controlled-temperature storage.',
    createdAt = new Date().toISOString()
  }) {
    this.alertId = alertId;
    this.shipmentId = shipmentId;
    this.sensorId = sensorId;
    this.readingId = readingId;
    this.temperatureCelsius = temperatureCelsius;
    this.allowedMinTemp = allowedMinTemp;
    this.allowedMaxTemp = allowedMaxTemp;
    this.severity = severity;
    this.durationMinutes = durationMinutes;
    this.startTime = startTime;
    this.status = status;
    this.recommendedAction = recommendedAction;
    this.createdAt = createdAt;
  }
}

module.exports = ColdChainAlert;
