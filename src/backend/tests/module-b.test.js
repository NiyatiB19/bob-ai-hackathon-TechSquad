const request = require('supertest');
const app = require('../app');

describe('Module B Shipment and Disruption API', () => {
  test('GET /api/shipments returns shipments', async () => {
    const res = await request(app).get('/api/shipments');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.shipments)).toBe(true);
  });

  test('create shipment with valid payload', async () => {
    const payload = {
      shipmentId: 'S900',
      trackingNumber: 'TRK-900',
      origin: { city: 'Mumbai', country: 'India' },
      destination: { city: 'Singapore', country: 'Singapore' },
      cargoType: 'Electronics',
      priority: 'high',
      status: 'planned',
      currentLocation: { city: 'Mumbai', country: 'India' },
      route: {
        name: 'Mumbai to Singapore',
        segments: [{ from: 'Mumbai', to: 'Singapore' }],
        distanceKm: 4500,
        durationHours: 120,
        status: 'available'
      },
      estimatedDeparture: '2026-09-16T08:00:00.000Z',
      estimatedArrival: '2026-09-23T10:00:00.000Z',
      carrier: 'OceanLine',
      temperatureSensitive: false,
      disruptionExposure: 'low'
    };

    const res = await request(app).post('/api/shipments').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shipment.shipmentId).toBe('S900');
  });

  test('GET /api/disruptions returns disruptions', async () => {
    const res = await request(app).get('/api/disruptions');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.disruptions)).toBe(true);
  });

  test('GET /api/shipments/affected returns affected shipments with reasons', async () => {
    const res = await request(app).get('/api/shipments/affected');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.shipments)).toBe(true);
  });

  test('GET /api/shipments/S102/risk returns risk details', async () => {
    const res = await request(app).get('/api/shipments/S102/risk');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shipmentId).toBe('S102');
    expect(Array.isArray(res.body.data.reasons)).toBe(true);
  });

  test('POST /api/routes/recommend returns ranked route recommendation', async () => {
    const payload = {
      shipmentId: 'S102',
      currentRoute: 'Mumbai -> Singapore',
      alternativeRoutes: [
        { routeId: 'R2', name: 'Mumbai -> Colombo -> Singapore', status: 'available', risk: 'LOW', delayHours: 8 },
        { routeId: 'R3', name: 'Mumbai -> Dubai -> Singapore', status: 'available', risk: 'MEDIUM', delayHours: 18 },
        { routeId: 'R1', name: 'Mumbai -> Singapore', status: 'disrupted', risk: 'HIGH', delayHours: 0 }
      ]
    };

    const res = await request(app).post('/api/routes/recommend').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.recommendedRoute).toBeDefined();
    expect(res.body.data.reason).toBeTruthy();
  });

  test('POST /api/carriers/recommend returns ranked carrier options', async () => {
    const payload = {
      shipmentId: 'S102',
      currentCarrier: 'OceanFast',
      carriers: [
        { carrierId: 'C1', name: 'OceanFast', available: false, delayHours: 0, risk: 'HIGH' },
        { carrierId: 'C2', name: 'BlueHarbor', available: true, delayHours: 10, risk: 'LOW' },
        { carrierId: 'C3', name: 'TradeBridge', available: true, delayHours: 18, risk: 'MEDIUM' }
      ]
    };

    const res = await request(app).post('/api/carriers/recommend').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.recommendedCarrier).toBeDefined();
  });

  test('invalid shipment payload is rejected', async () => {
    const res = await request(app).post('/api/shipments').send({ origin: 'bad' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('invalid disruption payload is rejected', async () => {
    const res = await request(app).post('/api/disruptions').send({ title: 'No type' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
