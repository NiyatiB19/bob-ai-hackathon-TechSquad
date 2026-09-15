/**
 * SupplyGuard AI — Cold-Chain Telemetry & Excursion Service
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

const { coldChainSensors, temperatureReadings, coldChainAlerts, shipments } = require('../mock/sampleData');
const TemperatureReading = require('../models/TemperatureReading');
const ColdChainAlert = require('../models/ColdChainAlert');

/**
 * Classifies excursion severity based on configured thermal thresholds and policy.
 *
 * Policy:
 * - NORMAL: min <= temp <= max
 * - WARNING: max < temp <= max + 3.0 OR min - 2.0 <= temp < min
 * - CRITICAL: temp > max + 3.0 OR temp < min - 2.0 OR continuous duration >= 60 mins
 */
function classifyExcursionSeverity(temperature, minAllowed, maxAllowed, durationMinutes = 0) {
  if (temperature >= minAllowed && temperature <= maxAllowed) {
    return 'NORMAL';
  }

  const isSevereHigh = temperature > maxAllowed + 3.0;
  const isSevereLow = temperature < minAllowed - 2.0;

  if (isSevereHigh || isSevereLow || durationMinutes >= 60) {
    return 'CRITICAL';
  }

  return 'WARNING';
}

/**
 * Calculates excursion duration in minutes for a given shipment from reading history.
 */
function calculateExcursionDuration(shipmentId) {
  const readings = temperatureReadings
    .filter(r => r.shipmentId === shipmentId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (readings.length === 0) return { durationMinutes: 0, startTime: null, maxTemp: null };

  let excursionStartTime = null;
  let maxTemp = -Infinity;

  for (const r of readings) {
    if (r.isExcursion) {
      if (!excursionStartTime) {
        excursionStartTime = new Date(r.timestamp);
      }
      if (r.temperatureCelsius > maxTemp) {
        maxTemp = r.temperatureCelsius;
      }
    } else {
      // Excursion ended / returned to safe range
      excursionStartTime = null;
    }
  }

  if (!excursionStartTime) {
    return { durationMinutes: 0, startTime: null, maxTemp: null, isCurrentlyExcursion: false };
  }

  const latestTime = new Date(readings[readings.length - 1].timestamp);
  const durationMinutes = Math.max(0, Math.round((latestTime - excursionStartTime) / (1000 * 60)));

  return {
    durationMinutes,
    startTime: excursionStartTime.toISOString(),
    maxTemp: maxTemp === -Infinity ? null : maxTemp,
    isCurrentlyExcursion: true
  };
}

/**
 * Returns overall cold-chain telemetry metrics and active thermal alerts.
 */
function getColdChainOverview() {
  const monitoredSensors = coldChainSensors.length;
  const activeAlertsList = coldChainAlerts.filter(a => a.status === 'ACTIVE');

  // Compute status counts across shipments
  let normalCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  const shipmentIds = [...new Set(coldChainSensors.map(s => s.shipmentId))];

  for (const shpId of shipmentIds) {
    const history = getShipmentTelemetry(shpId);
    if (history.currentSeverity === 'CRITICAL') {
      criticalCount++;
    } else if (history.currentSeverity === 'WARNING') {
      warningCount++;
    } else {
      normalCount++;
    }
  }

  const totalMonitored = shipmentIds.length || 1;
  const compliancePercentage = Math.round((normalCount / totalMonitored) * 100);

  return {
    monitoredShipments: totalMonitored,
    normalShipments: normalCount,
    warningShipments: warningCount,
    criticalShipments: criticalCount,
    activeAlerts: activeAlertsList,
    compliancePercentage,
    summary: `${normalCount} normal, ${warningCount} warning, ${criticalCount} critical out of ${totalMonitored} monitored cold-chain shipments.`
  };
}

/**
 * Retrieves historical temperature readings and excursion status for a specific shipment.
 */
function getShipmentTelemetry(shipmentId) {
  if (!shipmentId) {
    throw new Error('shipmentId is required');
  }

  const sensor = coldChainSensors.find(s => s.shipmentId === shipmentId) || {
    sensorId: `sns_default_${shipmentId}`,
    shipmentId,
    targetTempMin: 2.0,
    targetTempMax: 8.0,
    deviceModel: 'ThermoSense IoT-X'
  };

  const shipment = shipments.find(s => s.shipmentId === shipmentId || s.id === shipmentId);
  const minAllowed = shipment?.requiredTemperatureRange?.min ?? sensor.targetTempMin ?? 2.0;
  const maxAllowed = shipment?.requiredTemperatureRange?.max ?? sensor.targetTempMax ?? 8.0;

  const history = temperatureReadings
    .filter(r => r.shipmentId === shipmentId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const latestReading = history[history.length - 1];
  const currentTemp = latestReading ? latestReading.temperatureCelsius : 4.0;

  const durationData = calculateExcursionDuration(shipmentId);

  const currentSeverity = latestReading
    ? classifyExcursionSeverity(currentTemp, minAllowed, maxAllowed, durationData.durationMinutes)
    : 'NORMAL';

  const isExcursion = currentTemp < minAllowed || currentTemp > maxAllowed;

  // Recovery detection: if latest reading is safe but previous was excursion
  const isRecovered = !isExcursion && history.length > 1 && history[history.length - 2].isExcursion;

  return {
    shipmentId,
    sensor,
    requiredTemperatureRange: { min: minAllowed, max: maxAllowed, unit: 'C' },
    currentTemperatureCelsius: currentTemp,
    isExcursion,
    currentSeverity,
    excursionDetails: {
      durationMinutes: durationData.durationMinutes,
      startTime: durationData.startTime,
      maxTemperatureRecorded: durationData.maxTemp || currentTemp,
      isRecovered
    },
    readings: history.map(r => ({
      readingId: r.readingId,
      timestamp: r.timestamp,
      temperatureCelsius: r.temperatureCelsius,
      allowedMinTemp: r.allowedMinTemp || minAllowed,
      allowedMaxTemp: r.allowedMaxTemp || maxAllowed,
      isExcursion: r.isExcursion,
      severity: r.severity
    }))
  };
}

/**
 * Ingests a new IoT temperature sensor reading and computes excursion, duration, severity, and alerts.
 */
function processTelemetryReading({ shipmentId, sensorId, temperatureCelsius, timestamp, location }) {
  if (!shipmentId || temperatureCelsius === undefined || temperatureCelsius === null) {
    throw new Error('shipmentId and temperatureCelsius are required');
  }

  const tempVal = Number(temperatureCelsius);
  if (Number.isNaN(tempVal)) {
    throw new Error('temperatureCelsius must be a valid number');
  }

  const sensor = coldChainSensors.find(s => s.shipmentId === shipmentId || s.sensorId === sensorId);
  const shipment = shipments.find(s => s.shipmentId === shipmentId || s.id === shipmentId);

  const minAllowed = shipment?.requiredTemperatureRange?.min ?? sensor?.targetTempMin ?? 2.0;
  const maxAllowed = shipment?.requiredTemperatureRange?.max ?? sensor?.targetTempMax ?? 8.0;

  const isExcursion = tempVal < minAllowed || tempVal > maxAllowed;

  // Temporarily push to history to calculate duration accurately
  const readingTime = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
  const readingId = `rdg_${Date.now()}`;

  const tempRecord = {
    readingId,
    sensorId: sensorId || sensor?.sensorId || `sns_${shipmentId}`,
    shipmentId,
    timestamp: readingTime,
    temperatureCelsius: tempVal,
    allowedMinTemp: minAllowed,
    allowedMaxTemp: maxAllowed,
    isExcursion,
    location
  };

  temperatureReadings.push(tempRecord);

  const durationData = calculateExcursionDuration(shipmentId);
  const severity = classifyExcursionSeverity(tempVal, minAllowed, maxAllowed, durationData.durationMinutes);
  tempRecord.severity = severity;

  let generatedAlert = null;

  if (isExcursion) {
    const recommendedAction = severity === 'CRITICAL'
      ? 'Inspect shipment immediately and move cargo to controlled-temperature storage.'
      : 'Monitor temperature trends and verify reefer cooling system.';

    generatedAlert = new ColdChainAlert({
      alertId: `alt_${Date.now()}`,
      shipmentId,
      sensorId: tempRecord.sensorId,
      readingId,
      temperatureCelsius: tempVal,
      allowedMinTemp: minAllowed,
      allowedMaxTemp: maxAllowed,
      severity,
      durationMinutes: durationData.durationMinutes,
      startTime: durationData.startTime || readingTime,
      status: 'ACTIVE',
      recommendedAction
    });

    // Replace existing active alert for shipment if any, or push new
    const existingIndex = coldChainAlerts.findIndex(a => a.shipmentId === shipmentId && a.status === 'ACTIVE');
    if (existingIndex !== -1) {
      coldChainAlerts[existingIndex] = generatedAlert;
    } else {
      coldChainAlerts.push(generatedAlert);
    }
  } else {
    // Check if shipment just recovered from an excursion
    const activeAlert = coldChainAlerts.find(a => a.shipmentId === shipmentId && a.status === 'ACTIVE');
    if (activeAlert) {
      activeAlert.status = 'RESOLVED';
      activeAlert.resolvedTime = readingTime;
    }
  }

  return {
    reading: tempRecord,
    analysis: {
      isExcursion,
      severity,
      durationMinutes: durationData.durationMinutes,
      maxTemperatureRecorded: durationData.maxTemp || tempVal,
      alertGenerated: generatedAlert
    }
  };
}

/**
 * Returns all active cold-chain alerts.
 */
function getColdChainAlerts() {
  return coldChainAlerts;
}

/**
 * Marks a cold-chain alert as acknowledged.
 */
function acknowledgeColdChainAlert(alertId) {
  const alert = coldChainAlerts.find(a => a.alertId === alertId || a.id === alertId);
  if (!alert) {
    throw new Error(`Cold-chain alert ${alertId} was not found.`);
  }

  alert.status = 'ACKNOWLEDGED';
  alert.acknowledgedAt = new Date().toISOString();

  return {
    success: true,
    message: `Alert ${alertId} acknowledged successfully.`,
    alert
  };
}

module.exports = {
  classifyExcursionSeverity,
  getColdChainOverview,
  getShipmentTelemetry,
  processTelemetryReading,
  getColdChainAlerts,
  acknowledgeColdChainAlert
};
