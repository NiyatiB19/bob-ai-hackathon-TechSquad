const shipments = [
  {
    shipmentId: 'S101',
    trackingNumber: 'TRK-1001',
    origin: { city: 'Mumbai', country: 'India' },
    destination: { city: 'Singapore', country: 'Singapore' },
    currentLocation: { city: 'Mumbai', country: 'India' },
    cargoType: 'Electronics',
    priority: 'medium',
    status: 'planned',
    route: {
      name: 'Mumbai -> Singapore',
      segments: [{ from: 'Mumbai', to: 'Singapore' }],
      distanceKm: 4400,
      durationHours: 120,
      status: 'available',
      risk: 'LOW'
    },
    estimatedDeparture: '2026-09-15T08:00:00.000Z',
    estimatedArrival: '2026-09-22T12:00:00.000Z',
    carrier: 'OceanFast',
    temperatureSensitive: false,
    disruptionExposure: 'low'
  },
  {
    shipmentId: 'S102',
    trackingNumber: 'TRK-1002',
    origin: { city: 'Mumbai', country: 'India' },
    destination: { city: 'Singapore', country: 'Singapore' },
    currentLocation: { city: 'Mumbai', country: 'India' },
    cargoType: 'Pharmaceuticals',
    priority: 'critical',
    status: 'in-transit',
    route: {
      name: 'Mumbai -> Singapore',
      segments: [{ from: 'Mumbai', to: 'Singapore' }],
      distanceKm: 4400,
      durationHours: 120,
      status: 'disrupted',
      risk: 'HIGH'
    },
    estimatedDeparture: '2026-09-12T12:00:00.000Z',
    estimatedArrival: '2026-09-20T18:00:00.000Z',
    carrier: 'OceanFast',
    temperatureSensitive: true,
    disruptionExposure: 'high',
    currentLocation: { city: 'Mumbai', country: 'India', port: 'Mumbai Port' }
  },
  {
    shipmentId: 'S103',
    trackingNumber: 'TRK-1003',
    origin: { city: 'Dubai', country: 'UAE' },
    destination: { city: 'London', country: 'UK' },
    currentLocation: { city: 'Dubai', country: 'UAE' },
    cargoType: 'Perishables',
    priority: 'high',
    status: 'delayed',
    route: {
      name: 'Dubai -> London',
      segments: [{ from: 'Dubai', to: 'London' }],
      distanceKm: 5800,
      durationHours: 150,
      status: 'available',
      risk: 'MEDIUM'
    },
    estimatedDeparture: '2026-09-13T09:00:00.000Z',
    estimatedArrival: '2026-09-22T09:00:00.000Z',
    carrier: 'TradeBridge',
    temperatureSensitive: true,
    disruptionExposure: 'medium'
  },
  {
    shipmentId: 'S104',
    trackingNumber: 'TRK-1004',
    origin: { city: 'Colombo', country: 'Sri Lanka' },
    destination: { city: 'Singapore', country: 'Singapore' },
    currentLocation: { city: 'Colombo', country: 'Sri Lanka' },
    cargoType: 'Consumer Goods',
    priority: 'low',
    status: 'planned',
    route: {
      name: 'Colombo -> Singapore',
      segments: [{ from: 'Colombo', to: 'Singapore' }],
      distanceKm: 3500,
      durationHours: 96,
      status: 'available',
      risk: 'LOW'
    },
    estimatedDeparture: '2026-09-18T05:00:00.000Z',
    estimatedArrival: '2026-09-25T12:00:00.000Z',
    carrier: 'BlueHarbor',
    temperatureSensitive: false,
    disruptionExposure: 'low'
  }
];

const disruptions = [
  {
    disruptionId: 'D001',
    type: 'port-strike',
    name: 'Singapore Port Strike',
    title: 'Singapore Port Strike',
    location: { city: 'Singapore', country: 'Singapore', region: 'Port of Singapore' },
    affectedLocations: ['Singapore Port', 'Port of Singapore'],
    affectedRoutes: ['Mumbai -> Singapore', 'Colombo -> Singapore'],
    severity: 'high',
    status: 'active',
    startTime: '2026-09-12T00:00:00.000Z',
    expectedEndTime: '2026-09-18T12:00:00.000Z',
    description: 'Dock workers are on strike at Singapore Port, delaying transshipment and export operations.'
  },
  {
    disruptionId: 'D002',
    type: 'weather',
    name: 'Monsoon Weather Warning',
    title: 'Monsoon Weather Warning',
    location: { city: 'Mumbai', country: 'India', region: 'Western coast' },
    affectedLocations: ['Mumbai', 'Western Coast'],
    affectedRoutes: ['Mumbai -> Singapore'],
    severity: 'medium',
    status: 'active',
    startTime: '2026-09-10T12:00:00.000Z',
    expectedEndTime: '2026-09-17T20:00:00.000Z',
    description: 'Heavy monsoon conditions are affecting cargo loading and customs clearance in Mumbai.'
  },
  {
    disruptionId: 'D003',
    type: 'road-closure',
    name: 'Dubai Road Closure',
    title: 'Dubai Road Closure',
    location: { city: 'Dubai', country: 'UAE', region: 'Jebel Ali corridor' },
    affectedLocations: ['Jebel Ali', 'Dubai'],
    affectedRoutes: ['Dubai -> London'],
    severity: 'medium',
    status: 'active',
    startTime: '2026-09-14T06:00:00.000Z',
    expectedEndTime: '2026-09-16T18:00:00.000Z',
    description: 'A major road closure near Jebel Ali is slowing freight movement.'
  }
];

const carriers = [
  {
    carrierId: 'C1',
    name: 'OceanFast',
    available: false,
    delayHours: 0,
    risk: 'HIGH',
    capacity: 'medium',
    routeCoverage: ['Mumbai -> Singapore']
  },
  {
    carrierId: 'C2',
    name: 'BlueHarbor',
    available: true,
    delayHours: 10,
    risk: 'LOW',
    capacity: 'high',
    routeCoverage: ['Colombo -> Singapore', 'Mumbai -> Singapore']
  },
  {
    carrierId: 'C3',
    name: 'TradeBridge',
    available: true,
    delayHours: 18,
    risk: 'MEDIUM',
    capacity: 'medium',
    routeCoverage: ['Dubai -> London', 'Mumbai -> Singapore']
  }
];

const routes = [
  {
    routeId: 'R1',
    name: 'Mumbai -> Singapore',
    status: 'disrupted',
    risk: 'HIGH',
    delayHours: 0,
    distanceKm: 4400,
    estimatedCostUSD: 16000,
    availability: false,
    transportMode: 'sea'
  },
  {
    routeId: 'R2',
    name: 'Mumbai -> Colombo -> Singapore',
    status: 'available',
    risk: 'LOW',
    delayHours: 8,
    distanceKm: 5000,
    estimatedCostUSD: 18000,
    availability: true,
    transportMode: 'sea'
  },
  {
    routeId: 'R3',
    name: 'Mumbai -> Dubai -> Singapore',
    status: 'available',
    risk: 'MEDIUM',
    delayHours: 18,
    distanceKm: 6100,
    estimatedCostUSD: 22000,
    availability: true,
    transportMode: 'sea'
  }
];

module.exports = { shipments, disruptions, carriers, routes };
