/**
 * SupplyGuard AI — Module D (Fleet & Cold Chain API) Jest Test Suite
 */

const request = require('supertest');
const app = require('../app');

describe('Module D Fleet & Cold Chain REST APIs', () => {
  test('GET /api/fleet returns list of fleet assets', async () => {
    const res = await request(app).get('/api/fleet');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.assets)).toBe(true);
  });

  test('GET /api/fleet/idle returns idle fleet assets', async () => {
    const res = await request(app).get('/api/fleet/idle');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.assets)).toBe(true);
  });

  test('GET /api/fleet/utilisation returns fleet utilisation score', async () => {
    const res = await request(app).get('/api/fleet/utilisation');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.averageUtilizationPercentage).toBe('number');
  });

  test('POST /api/fleet/recommend generates fleet redeployment recommendation', async () => {
    const res = await request(app)
      .post('/api/fleet/recommend')
      .send({ shipmentId: 'S102', requiredCapacityKg: 10000, refrigeratedRequired: true });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shipmentId).toBe('S102');
  });

  test('POST /api/fleet/redeploy updates fleet asset status to ASSIGNED', async () => {
    const res = await request(app)
      .post('/api/fleet/redeploy')
      .send({ shipmentId: 'S102', fleetAssetId: 'T14' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.asset.status).toBe('ASSIGNED');
  });

  test('GET /api/cold-chain returns cold-chain overview', async () => {
    const res = await request(app).get('/api/cold-chain');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.monitoredShipments).toBe('number');
  });

  test('GET /api/cold-chain/S205 returns shipment telemetry history', async () => {
    const res = await request(app).get('/api/cold-chain/S205');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shipmentId).toBe('S205');
  });

  test('POST /api/cold-chain/telemetry processes IoT temperature reading', async () => {
    const res = await request(app)
      .post('/api/cold-chain/telemetry')
      .send({ shipmentId: 'S205', temperatureCelsius: 15.0 });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.analysis.isExcursion).toBe(true);
    expect(res.body.data.analysis.severity).toBe('CRITICAL');
  });

  test('GET /api/cold-chain/alerts returns active cold-chain alerts', async () => {
    const res = await request(app).get('/api/cold-chain/alerts');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.alerts)).toBe(true);
  });

  test('POST /api/cold-chain/acknowledge acknowledges an alert', async () => {
    const alertsRes = await request(app).get('/api/cold-chain/alerts');
    const alertId = alertsRes.body.data.alerts[0]?.alertId || 'alt_8001';

    const res = await request(app)
      .post('/api/cold-chain/acknowledge')
      .send({ alertId });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.alert.status).toBe('ACKNOWLEDGED');
  });
});
