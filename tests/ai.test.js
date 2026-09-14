/**
 * SupplyGuard AI — Module C Automated Test Suite
 * tests/ai.test.js
 *
 * Verifies Risk Engine, Disruption Analysis, Route Optimizer, Fleet Optimizer,
 * Recommendation Engine, IBM Bob Adapter/Service, and REST API Endpoints.
 */

import assert from 'node:assert';
import { calculateShipmentRisk } from '../src/ai/analyzers/riskEngine.js';
import { analyzeDisruptionImpact } from '../src/ai/analyzers/disruptionEngine.js';
import { optimizeRoute } from '../src/ai/recommenders/routeOptimizer.js';
import { optimizeFleetRedeployment } from '../src/ai/recommenders/fleetOptimizer.js';
import { generateRecommendation } from '../src/ai/recommenders/recommendationEngine.js';
import { processBobQuery } from '../src/ai/bob/bobAdapter.js';
import { analyzeShipment } from '../src/ai/services/aiRecommendationService.js';
import { executeBobQuery } from '../src/ai/services/bobService.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mockDataPath = join(__dirname, '../src/ai/mock/mockData.json');
const mockData = JSON.parse(readFileSync(mockDataPath, 'utf8'));

async function runTests() {
  console.log('====================================================');
  console.log('  RUNNING MODULE C (AI + IBM BOB) TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}`);
      console.error(`    ${err.message}`);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}`);
      console.error(`    ${err.message}`);
    }
  }

  // ---------------------------------------------------
  // 1. RISK ENGINE TESTS
  // ---------------------------------------------------
  console.log('--- 1. RISK ENGINE TESTS ---');

  test('Risk Engine — Low risk normal shipment', () => {
    const shipment = { shipmentId: 'shp_test_1', priority: 'low', temperatureSensitive: false };
    const result = calculateShipmentRisk({ shipment });
    assert.strictEqual(result.riskLevel, 'low');
    assert(result.riskScore < 0.35);
  });

  test('Risk Engine — Medium risk shipment', () => {
    const shipment = { shipmentId: 'shp_test_2', priority: 'high', status: 'delayed', temperatureSensitive: false };
    const result = calculateShipmentRisk({ shipment });
    assert(['medium', 'high'].includes(result.riskLevel));
    assert(result.riskScore >= 0.35);
  });

  test('Risk Engine — Critical risk with disruption & cold-chain excursion', () => {
    const shipment = { shipmentId: 'shp_2001', priority: 'critical', status: 'stranded', temperatureSensitive: true };
    const disruption = { disruptionId: 'dis_3001', severity: 'critical', status: 'active' };
    const route = { routeId: 'route_101', availability: false, riskScore: 0.92 };
    const coldChain = { isExcursion: true, severity: 'critical', temperatureCelsius: 14.2 };

    const result = calculateShipmentRisk({ shipment, disruption, route, coldChainTelemetry: coldChain });
    assert.strictEqual(result.riskLevel, 'critical');
    assert(result.riskScore >= 0.75);
    assert(result.riskFactors.length > 3);
  });

  test('Risk Engine — Missing/invalid input handling', () => {
    const result = calculateShipmentRisk(null);
    assert.strictEqual(result.riskLevel, 'low');
    assert.strictEqual(result.riskScore, 0.0);
    assert(result.riskFactors.includes('No valid shipment payload provided'));
  });

  // ---------------------------------------------------
  // 2. DISRUPTION ENGINE TESTS
  // ---------------------------------------------------
  console.log('\n--- 2. DISRUPTION ENGINE TESTS ---');

  test('Disruption Engine — Affected shipment and route detection', () => {
    const disruptions = mockData.disruptions;
    const shipments = mockData.shipments;
    const routes = mockData.routes;

    const impacts = analyzeDisruptionImpact({ disruptions, shipments, routes });
    assert.strictEqual(impacts.length, disruptions.length);
    const blizzardImpact = impacts.find((i) => i.disruptionId === 'dis_3001');
    assert(blizzardImpact);
    assert(blizzardImpact.affectedShipmentIds.includes('shp_2001'));
  });

  test('Disruption Engine — Empty disruption array handling', () => {
    const impacts = analyzeDisruptionImpact({ disruptions: [] });
    assert.deepStrictEqual(impacts, []);
  });

  // ---------------------------------------------------
  // 3. ROUTE OPTIMIZER TESTS
  // ---------------------------------------------------
  console.log('\n--- 3. ROUTE OPTIMIZER TESTS ---');

  test('Route Optimizer — Selects available low-risk alternative route', () => {
    const shipment = mockData.shipments[0];
    const currentRoute = mockData.routes[0];
    const availableRoutes = mockData.routes;
    const disruption = mockData.disruptions[0];

    const result = optimizeRoute({ shipment, currentRoute, availableRoutes, disruption });
    assert(result.recommendedRoute !== null);
    assert.strictEqual(result.recommendedRoute.routeId, 'route_102');
    assert(result.recommendedRoute.riskScore < currentRoute.riskScore);
    assert(result.recommendedRoute.delayReductionHours > 0);
  });

  test('Route Optimizer — Handles case with no available alternatives', () => {
    const shipment = mockData.shipments[0];
    const currentRoute = mockData.routes[0];
    const availableRoutes = [{ routeId: 'route_101', availability: false }];

    const result = optimizeRoute({ shipment, currentRoute, availableRoutes });
    assert.strictEqual(result.recommendedRoute, null);
    assert(result.reason.includes('No available alternative route'));
  });

  // ---------------------------------------------------
  // 4. FLEET OPTIMIZER TESTS
  // ---------------------------------------------------
  console.log('\n--- 4. FLEET OPTIMIZER TESTS ---');

  test('Fleet Optimizer — Matches idle refrigerated truck for cold-chain shipment', () => {
    const shipment = mockData.shipments[0]; // shp_2001 (refrigerated, Surat)
    const fleetAssets = mockData.fleet;

    const result = optimizeFleetRedeployment({ shipment, fleetAssets });
    assert(result.recommendedAsset !== null);
    assert.strictEqual(result.recommendedAsset.fleetAssetId, 'flt_5001');
    assert(result.recommendedAsset.isRefrigerated);
    assert(result.recommendedAsset.suitabilityScore >= 0.80);
  });

  test('Fleet Optimizer — Handles case with no idle assets', () => {
    const shipment = mockData.shipments[0];
    const busyFleet = [{ fleetAssetId: 'flt_busy', status: 'active' }];

    const result = optimizeFleetRedeployment({ shipment, fleetAssets: busyFleet });
    assert.strictEqual(result.recommendedAsset, null);
    assert(result.reason.includes('No idle fleet assets'));
  });

  // ---------------------------------------------------
  // 5. RECOMMENDATION ENGINE TESTS
  // ---------------------------------------------------
  console.log('\n--- 5. RECOMMENDATION ENGINE TESTS ---');

  test('Recommendation Engine — Prioritizes reroute and redeploy for cold-chain emergency', () => {
    const shipment = mockData.shipments[0];
    const disruption = mockData.disruptions[0];
    const currentRoute = mockData.routes[0];
    const availableRoutes = mockData.routes;
    const fleetAssets = mockData.fleet;
    const coldChainTelemetry = mockData.temperatureReadings[0];

    const result = generateRecommendation({
      shipment,
      disruption,
      currentRoute,
      availableRoutes,
      fleetAssets,
      coldChainTelemetry
    });

    assert.strictEqual(result.type, 'reroute_and_redeploy');
    assert.strictEqual(result.riskLevel, 'critical');
    assert(result.reason.length > 20);
    assert(result.expectedBenefit.length > 10);
    assert(result.remainingRisk.length > 5);
  });

  // ---------------------------------------------------
  // 6. IBM BOB ADAPTER & SERVICE TESTS
  // ---------------------------------------------------
  console.log('\n--- 6. IBM BOB ADAPTER & SERVICE TESTS ---');

  test('IBM Bob Adapter — Processes cold-chain emergency query', () => {
    const result = processBobQuery({
      prompt: 'Which cold chain shipment needs emergency help?',
      dataContext: mockData
    });

    assert(result.response.includes('shp_2001'));
    assert.strictEqual(result.structuredContext.primaryAffectedShipmentId, 'shp_2001');
    assert.strictEqual(result.structuredContext.suggestedActionType, 'reroute_and_redeploy');
  });

  test('IBM Bob Adapter — Processes fleet redeployment query', () => {
    const result = processBobQuery({
      prompt: 'Which idle fleet assets can we redeploy?',
      dataContext: mockData
    });

    assert(result.response.includes('flt_5001') || result.response.includes('Fleet Optimization'));
    assert.strictEqual(result.structuredContext.suggestedActionType, 'redeploy_fleet');
  });

  await asyncTest('IBM Bob Service — Throws 400 error on missing prompt', async () => {
    try {
      await executeBobQuery({ prompt: '' });
      assert.fail('Should have thrown error on empty prompt');
    } catch (err) {
      assert.strictEqual(err.statusCode, 400);
      assert(err.message.includes('Prompt string is required'));
    }
  });

  // ---------------------------------------------------
  // 7. SERVICE & API ENDPOINT LOGIC TESTS
  // ---------------------------------------------------
  console.log('\n--- 7. SERVICE & API INTEGRATION TESTS ---');

  await asyncTest('AI Service — analyzeShipment returns complete analysis package', async () => {
    const result = await analyzeShipment({ shipmentId: 'shp_2001', customContext: mockData });
    assert.strictEqual(result.shipmentId, 'shp_2001');
    assert(result.recommendation);
    assert.strictEqual(result.recommendation.riskLevel, 'critical');
  });

  await asyncTest('Bob Service — executeBobQuery returns structured response envelope', async () => {
    const result = await executeBobQuery({ prompt: 'What shipments are at highest risk?', customContext: mockData });
    assert(result.response);
    assert(result.structuredContext);
    assert.strictEqual(result.structuredContext.primaryAffectedShipmentId, 'shp_2001');
  });

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passed} / ${total} SUITES PASSED`);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner exception:', err);
  process.exit(1);
});
