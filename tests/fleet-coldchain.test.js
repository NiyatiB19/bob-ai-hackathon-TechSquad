/**
 * SupplyGuard AI — Module D (Fleet Utilisation & Cold-Chain Monitoring) Test Suite
 */

import assert from 'node:assert';
import {
  getFleetAssets,
  getFleetAssetById,
  getIdleFleetAssets,
  getFleetUtilisation,
  recommendFleetRedeployment,
  redeployFleetAsset
} from '../src/backend/services/fleetService.js';

import {
  classifyExcursionSeverity,
  getColdChainOverview,
  getShipmentTelemetry,
  processTelemetryReading,
  getColdChainAlerts,
  acknowledgeColdChainAlert
} from '../src/backend/services/coldChainService.js';

import { executeBobQuery } from '../src/ai/services/bobService.js';
import sampleData from '../src/backend/mock/sampleData.js';

let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } catch (err) {
    console.error(`  ✗ [FAIL] ${testName}: ${err.message}`);
    throw err;
  }
}

async function runAsyncTest(testName, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } catch (err) {
    console.error(`  ✗ [FAIL] ${testName}: ${err.message}`);
    throw err;
  }
}

console.log('====================================================');
console.log('  RUNNING MODULE D (FLEET & COLD-CHAIN) TEST SUITE  ');
console.log('====================================================');

console.log('\n--- 1. FLEET ASSET & IDLE DETECTION TESTS ---');

runTest('1. Fleet Listing — Retrieves registered fleet assets', () => {
  const assets = getFleetAssets();
  assert.ok(Array.isArray(assets));
  assert.ok(assets.length >= 4);
});

runTest('2. Fleet Detail — Retrieves asset profile by ID', () => {
  const asset = getFleetAssetById('T14') || getFleetAssetById('flt_5001');
  assert.ok(asset !== null);
  assert.ok(asset.fleetAssetId === 'T14' || asset.fleetAssetId === 'flt_5001');
});

runTest('3. Idle Fleet Detection — Correctly identifies idle assets', () => {
  const idleAssets = getIdleFleetAssets();
  assert.ok(Array.isArray(idleAssets));
  assert.ok(idleAssets.length > 0);
  assert.ok(idleAssets.every(a => a.status.toUpperCase() === 'IDLE'));
});

runTest('4. Fleet Utilisation — Calculates average utilization percentage & status', () => {
  const util = getFleetUtilisation();
  assert.ok(typeof util.averageUtilizationPercentage === 'number');
  assert.ok(['Fully Utilised', 'Partially Utilised', 'Under Utilised', 'Idle'].includes(util.operationalStatus));
  assert.ok(util.totalAssets >= 4);
});

console.log('\n--- 2. FLEET MATCHING & REDEPLOYMENT TESTS ---');

runTest('5. Fleet-Shipment Matching — Generates redeployment recommendation for S102', () => {
  const rec = recommendFleetRedeployment({
    shipmentId: 'S102',
    requiredCapacityKg: 10000,
    refrigeratedRequired: true
  });

  assert.strictEqual(rec.shipmentId, 'S102');
  assert.strictEqual(rec.recommendation, 'REDEPLOY');
  assert.ok(rec.fleetAssetId !== null);
  assert.ok(Array.isArray(rec.reason));
  assert.ok(rec.reason.length >= 2);
});

runTest('6. Fleet Redeployment Execution — Updates asset status to ASSIGNED', () => {
  const result = redeployFleetAsset({
    shipmentId: 'S102',
    fleetAssetId: 'T14'
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.asset.status, 'ASSIGNED');
  assert.strictEqual(result.asset.assignedShipmentId, 'S102');
});

runTest('7. Fleet Error Handling — Throws error on missing parameters', () => {
  assert.throws(() => recommendFleetRedeployment({}), /shipmentId is required/);
  assert.throws(() => redeployFleetAsset({ shipmentId: 'S102' }), /fleetAssetId/);
});

console.log('\n--- 3. COLD-CHAIN TELEMETRY & EXCURSION TESTS ---');

runTest('8. Cold-Chain Overview — Retrieves thermal compliance metrics', () => {
  const overview = getColdChainOverview();
  assert.ok(typeof overview.monitoredShipments === 'number');
  assert.ok(typeof overview.compliancePercentage === 'number');
  assert.ok(Array.isArray(overview.activeAlerts));
});

runTest('9. Normal Temperature Processing — Identifies compliant sensor log', () => {
  const result = processTelemetryReading({
    shipmentId: 'S206',
    sensorId: 'sns_6003',
    temperatureCelsius: 5.0
  });

  assert.strictEqual(result.analysis.isExcursion, false);
  assert.strictEqual(result.analysis.severity, 'NORMAL');
  assert.strictEqual(result.analysis.alertGenerated, null);
});

runTest('10. Warning Excursion Detection — Identifies minor thermal breach', () => {
  const result = processTelemetryReading({
    shipmentId: 'S103',
    sensorId: 'sns_6004',
    temperatureCelsius: 10.8,
    timestamp: '2026-09-15T11:35:00.000Z'
  });

  assert.strictEqual(result.analysis.isExcursion, true);
  assert.strictEqual(result.analysis.severity, 'WARNING');
  assert.ok(result.analysis.alertGenerated !== null);
});

runTest('11. Critical Excursion Detection — Identifies severe thermal breach', () => {
  const result = processTelemetryReading({
    shipmentId: 'S205',
    sensorId: 'sns_6002',
    temperatureCelsius: 15.0,
    timestamp: '2026-09-15T12:05:00.000Z'
  });

  assert.strictEqual(result.analysis.isExcursion, true);
  assert.strictEqual(result.analysis.severity, 'CRITICAL');
  assert.ok(result.analysis.alertGenerated !== null);
  assert.strictEqual(result.analysis.alertGenerated.severity, 'CRITICAL');
});

runTest('12. Excursion Duration & History — Calculates duration outside safe range', () => {
  const telem = getShipmentTelemetry('S205');
  assert.strictEqual(telem.shipmentId, 'S205');
  assert.ok(Array.isArray(telem.readings));
  assert.ok(telem.excursionDetails.durationMinutes >= 0);
});

runTest('13. Temperature Recovery — Flags when temperature returns to safe range', () => {
  const result = processTelemetryReading({
    shipmentId: 'S205',
    sensorId: 'sns_6002',
    temperatureCelsius: 5.0,
    timestamp: '2026-09-15T13:00:00.000Z'
  });

  assert.strictEqual(result.analysis.isExcursion, false);
  assert.strictEqual(result.analysis.severity, 'NORMAL');
});

runTest('14. Cold-Chain Alerts & Acknowledgement — Lists and acknowledges alerts', () => {
  const alerts = getColdChainAlerts();
  assert.ok(Array.isArray(alerts));
  assert.ok(alerts.length > 0);

  const targetAlert = alerts[0];
  const ack = acknowledgeColdChainAlert(targetAlert.alertId);
  assert.strictEqual(ack.success, true);
  assert.strictEqual(ack.alert.status, 'ACKNOWLEDGED');
});

runTest('15. Cold-Chain Validation & Error Handling — Validates invalid sensor payloads', () => {
  assert.throws(() => processTelemetryReading({ shipmentId: 'S205' }), /temperatureCelsius/);
  assert.throws(() => processTelemetryReading({ temperatureCelsius: 5.0 }), /shipmentId/);
  assert.throws(() => acknowledgeColdChainAlert('INVALID_ALT_999'), /was not found/);
});

console.log('\n--- 4. END-TO-END SCENARIO INTEGRATION TEST ---');

await runAsyncTest('16. End-to-End Scenario Flow — Disruption -> Redeployment -> Cold-Chain Excursion -> IBM Bob', async () => {
  const affectedShipment = sampleData.shipments.find(s => s.shipmentId === 'S102');
  assert.ok(affectedShipment !== null);

  const idleAssets = getIdleFleetAssets();
  const candidate = idleAssets.find(a => a.status.toUpperCase() === 'IDLE');
  assert.ok(candidate !== null);

  const rec = recommendFleetRedeployment({ shipmentId: 'S102' });
  assert.strictEqual(rec.recommendation, 'REDEPLOY');

  const telemResult = processTelemetryReading({
    shipmentId: 'S205',
    temperatureCelsius: 15.0
  });
  assert.strictEqual(telemResult.analysis.severity, 'CRITICAL');

  const bobRes = await executeBobQuery({
    prompt: 'Which cold-chain shipment is at highest risk and what idle truck is available?'
  });
  assert.ok(typeof bobRes.response === 'string');
  assert.ok(bobRes.response.length > 0);
});

console.log('====================================================');
console.log(`  TEST RESULTS: ${passedTests} / ${totalTests} SUITES PASSED`);
console.log('====================================================\n');
