const shipments = [
  {
    shipmentId: 'S101',
    trackingNumber: 'TRK-1001',
    origin: { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    destination: { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
    currentLocation: { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
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
    origin: { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    destination: { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
    currentLocation: { city: 'Mumbai', country: 'India', port: 'Mumbai Port', lat: 19.0760, lng: 72.8777 },
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
    requiredTemperatureRange: { min: 2.0, max: 8.0, unit: 'C' },
    disruptionExposure: 'high'
  },
  {
    shipmentId: 'S103',
    trackingNumber: 'TRK-1003',
    origin: { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
    destination: { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
    currentLocation: { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
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
    requiredTemperatureRange: { min: 4.0, max: 10.0, unit: 'C' },
    disruptionExposure: 'medium'
  },
  {
    shipmentId: 'S104',
    trackingNumber: 'TRK-1004',
    origin: { city: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lng: 79.8612 },
    destination: { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
    currentLocation: { city: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lng: 79.8612 },
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
  },
  {
    shipmentId: 'S205',
    trackingNumber: 'TRK-2005',
    origin: { city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
    destination: { city: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.5820 },
    currentLocation: { city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
    cargoType: 'Vaccines',
    priority: 'critical',
    status: 'in-transit',
    route: {
      name: 'Frankfurt -> Munich',
      segments: [{ from: 'Frankfurt', to: 'Munich' }],
      distanceKm: 390,
      durationHours: 5,
      status: 'available',
      risk: 'CRITICAL'
    },
    estimatedDeparture: '2026-09-15T06:00:00.000Z',
    estimatedArrival: '2026-09-15T12:00:00.000Z',
    carrier: 'EuroFreight Express',
    temperatureSensitive: true,
    requiredTemperatureRange: { min: 2.0, max: 8.0, unit: 'C' },
    disruptionExposure: 'high'
  },
  {
    shipmentId: 'S206',
    trackingNumber: 'TRK-2006',
    origin: { city: 'Rotterdam', country: 'Netherlands', lat: 51.9244, lng: 4.4777 },
    destination: { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
    currentLocation: { city: 'Rotterdam', country: 'Netherlands', lat: 51.9244, lng: 4.4777 },
    cargoType: 'Insulin Products',
    priority: 'high',
    status: 'in-transit',
    route: {
      name: 'Rotterdam -> Berlin',
      segments: [{ from: 'Rotterdam', to: 'Berlin' }],
      distanceKm: 690,
      durationHours: 8,
      status: 'available',
      risk: 'LOW'
    },
    estimatedDeparture: '2026-09-15T04:00:00.000Z',
    estimatedArrival: '2026-09-15T13:00:00.000Z',
    carrier: 'EuroFreight Express',
    temperatureSensitive: true,
    requiredTemperatureRange: { min: 2.0, max: 8.0, unit: 'C' },
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

/* Module D (Member 4) — Fleet Assets Seed Scenarios */
const fleetAssets = [
  {
    fleetAssetId: 'T14',
    assetName: 'Reefer Truck T14 (ColdGuard Heavy)',
    transportMode: 'truck',
    capacity: { maxWeightKg: 15000, volumeM3: 45, refrigerated: true },
    currentLocation: { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    status: 'IDLE',
    utilizationPercentage: 0,
    assignedShipmentId: null,
    driver: 'Rajesh Kumar',
    lastUpdated: '2026-09-15T10:00:00.000Z'
  },
  {
    fleetAssetId: 'flt_5001',
    assetName: 'ColdGuard Reefer Semi-Trailer T-408',
    transportMode: 'truck',
    capacity: { maxWeightKg: 24000, volumeM3: 85, refrigerated: true },
    currentLocation: { city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
    status: 'IDLE',
    utilizationPercentage: 0,
    assignedShipmentId: null,
    driver: 'Standby Crew A',
    lastUpdated: '2026-09-15T09:30:00.000Z'
  },
  {
    fleetAssetId: 'flt_5002',
    assetName: 'Express Freight Container Vessel V-90',
    transportMode: 'vessel',
    capacity: { maxWeightKg: 450000, volumeM3: 1200, refrigerated: false },
    currentLocation: { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    status: 'IN_TRANSIT',
    utilizationPercentage: 88,
    assignedShipmentId: 'S101',
    driver: 'Captain V. Sharma',
    lastUpdated: '2026-09-15T08:00:00.000Z'
  },
  {
    fleetAssetId: 'flt_5003',
    assetName: 'Air Cargo Pallet Container A-102',
    transportMode: 'container',
    capacity: { maxWeightKg: 10000, volumeM3: 30, refrigerated: true },
    currentLocation: { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
    status: 'ASSIGNED',
    utilizationPercentage: 75,
    assignedShipmentId: 'S103',
    driver: 'Logistics Crew B',
    lastUpdated: '2026-09-15T07:15:00.000Z'
  },
  {
    fleetAssetId: 'flt_5004',
    assetName: 'Heavy Duty Carrier 04',
    transportMode: 'truck',
    capacity: { maxWeightKg: 18000, volumeM3: 50, refrigerated: false },
    currentLocation: { city: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
    status: 'MAINTENANCE',
    utilizationPercentage: 0,
    assignedShipmentId: null,
    driver: 'Depot Repair Shop',
    lastUpdated: '2026-09-15T06:00:00.000Z'
  }
];

/* Module D (Member 4) — Cold-Chain IoT Sensors & Readings Seed Scenarios */
const coldChainSensors = [
  {
    sensorId: 'sns_6001',
    shipmentId: 'S102',
    deviceModel: 'ThermoSense Pro IoT-X',
    batteryStatus: 94,
    targetTempMin: 2.0,
    targetTempMax: 8.0,
    isActive: true,
    createdAt: '2026-09-12T12:00:00.000Z'
  },
  {
    sensorId: 'sns_6002',
    shipmentId: 'S205',
    deviceModel: 'ThermoGuard Ultra IoT',
    batteryStatus: 88,
    targetTempMin: 2.0,
    targetTempMax: 8.0,
    isActive: true,
    createdAt: '2026-09-15T06:00:00.000Z'
  },
  {
    sensorId: 'sns_6003',
    shipmentId: 'S206',
    deviceModel: 'ThermoSense Standard',
    batteryStatus: 98,
    targetTempMin: 2.0,
    targetTempMax: 8.0,
    isActive: true,
    createdAt: '2026-09-15T04:00:00.000Z'
  },
  {
    sensorId: 'sns_6004',
    shipmentId: 'S103',
    deviceModel: 'FruitFresh Monitor IoT',
    batteryStatus: 91,
    targetTempMin: 4.0,
    targetTempMax: 10.0,
    isActive: true,
    createdAt: '2026-09-13T09:00:00.000Z'
  }
];

const temperatureReadings = [
  // Normal cold-chain reading (S206)
  {
    readingId: 'rdg_7001',
    sensorId: 'sns_6003',
    shipmentId: 'S206',
    timestamp: '2026-09-15T11:00:00.000Z',
    temperatureCelsius: 4.5,
    allowedMinTemp: 2.0,
    allowedMaxTemp: 8.0,
    isExcursion: false,
    severity: 'NORMAL'
  },
  // Warning temperature excursion (S103: 10.8°C vs 10.0°C max allowed)
  {
    readingId: 'rdg_7002',
    sensorId: 'sns_6004',
    shipmentId: 'S103',
    timestamp: '2026-09-15T11:30:00.000Z',
    temperatureCelsius: 10.8,
    allowedMinTemp: 4.0,
    allowedMaxTemp: 10.0,
    isExcursion: true,
    severity: 'WARNING'
  },
  // Critical temperature excursion timeline for S205 (Vaccines: 2-8°C allowed)
  {
    readingId: 'rdg_7003_1',
    sensorId: 'sns_6002',
    shipmentId: 'S205',
    timestamp: '2026-09-15T10:00:00.000Z',
    temperatureCelsius: 4.0,
    allowedMinTemp: 2.0,
    allowedMaxTemp: 8.0,
    isExcursion: false,
    severity: 'NORMAL'
  },
  {
    readingId: 'rdg_7003_2',
    sensorId: 'sns_6002',
    shipmentId: 'S205',
    timestamp: '2026-09-15T10:30:00.000Z',
    temperatureCelsius: 5.0,
    allowedMinTemp: 2.0,
    allowedMaxTemp: 8.0,
    isExcursion: false,
    severity: 'NORMAL'
  },
  {
    readingId: 'rdg_7003_3',
    sensorId: 'sns_6002',
    shipmentId: 'S205',
    timestamp: '2026-09-15T11:00:00.000Z',
    temperatureCelsius: 7.0,
    allowedMinTemp: 2.0,
    allowedMaxTemp: 8.0,
    isExcursion: false,
    severity: 'NORMAL'
  },
  {
    readingId: 'rdg_7003_4',
    sensorId: 'sns_6002',
    shipmentId: 'S205',
    timestamp: '2026-09-15T11:30:00.000Z',
    temperatureCelsius: 12.0,
    allowedMinTemp: 2.0,
    allowedMaxTemp: 8.0,
    isExcursion: true,
    severity: 'WARNING'
  },
  {
    readingId: 'rdg_7003_5',
    sensorId: 'sns_6002',
    shipmentId: 'S205',
    timestamp: '2026-09-15T12:00:00.000Z',
    temperatureCelsius: 15.0,
    allowedMinTemp: 2.0,
    allowedMaxTemp: 8.0,
    isExcursion: true,
    severity: 'CRITICAL'
  },
  {
    readingId: 'rdg_7003_6',
    sensorId: 'sns_6002',
    shipmentId: 'S205',
    timestamp: '2026-09-15T12:30:00.000Z',
    temperatureCelsius: 14.0,
    allowedMinTemp: 2.0,
    allowedMaxTemp: 8.0,
    isExcursion: true,
    severity: 'CRITICAL'
  },
  // Temperature returns to safe range (recovery)
  {
    readingId: 'rdg_7003_7',
    sensorId: 'sns_6002',
    shipmentId: 'S205',
    timestamp: '2026-09-15T13:00:00.000Z',
    temperatureCelsius: 7.0,
    allowedMinTemp: 2.0,
    allowedMaxTemp: 8.0,
    isExcursion: false,
    severity: 'NORMAL'
  }
];

const coldChainAlerts = [
  {
    alertId: 'alt_8001',
    shipmentId: 'S205',
    sensorId: 'sns_6002',
    readingId: 'rdg_7003_5',
    temperatureCelsius: 15.0,
    allowedMinTemp: 2.0,
    allowedMaxTemp: 8.0,
    severity: 'CRITICAL',
    durationMinutes: 90,
    startTime: '2026-09-15T11:30:00.000Z',
    status: 'ACTIVE',
    recommendedAction: 'Inspect shipment S205 immediately and transfer cargo to controlled-temperature storage unit.',
    createdAt: '2026-09-15T12:00:00.000Z'
  },
  {
    alertId: 'alt_8002',
    shipmentId: 'S103',
    sensorId: 'sns_6004',
    readingId: 'rdg_7002',
    temperatureCelsius: 10.8,
    allowedMinTemp: 4.0,
    allowedMaxTemp: 10.0,
    severity: 'WARNING',
    durationMinutes: 30,
    startTime: '2026-09-15T11:30:00.000Z',
    status: 'ACTIVE',
    recommendedAction: 'Monitor container cooling compressor and verify ventilation settings.',
    createdAt: '2026-09-15T11:30:00.000Z'
  }
];

module.exports = {
  shipments,
  disruptions,
  carriers,
  routes,
  fleetAssets,
  coldChainSensors,
  temperatureReadings,
  coldChainAlerts
};
