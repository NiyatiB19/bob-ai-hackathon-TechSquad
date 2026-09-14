/**
 * SupplyGuard AI — Comprehensive Master Mock Dataset
 * Module A (Member 1 - Frontend)
 * 
 * Interconnects disruptions, alternative routes, fleet assets,
 * cold-chain telemetry excursions, and IBM Bob recommendations.
 */

export const disruptionsMockData = [
  {
    id: 'dis_3001',
    title: 'Port Congestion & Strike',
    location: 'Port of Singapore',
    type: 'Port',
    severity: 'High',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
    startTime: '2026-03-14T08:00:00.000Z',
    expectedEnd: '2026-03-16T18:00:00.000Z',
    timeAgo: '2 hours ago',
    affectedArea: 'Berth 12 & Container Terminal 4',
    description: 'Labor strike and severe vessel berth congestion causing 48+ hour unloading delays across South East Asia trade corridors.',
    affectedShipments: ['SG-1001', 'SG-1004', 'SG-1008'],
    recommendedAction: 'Reroute vessel via Johor Bypass and redeploy idle Reefer FL-002 for priority land transport.'
  },
  {
    id: 'dis_3002',
    title: 'Severe Weather & Flood Alert',
    location: 'Rotterdam, Netherlands',
    type: 'Weather',
    severity: 'Medium',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    startTime: '2026-03-14T04:30:00.000Z',
    expectedEnd: '2026-03-15T12:00:00.000Z',
    timeAgo: '5 hours ago',
    affectedArea: 'North Sea Approach Channel A3',
    description: 'High sea storm surge and coastal flooding restricting cargo vessel speed to 6 knots.',
    affectedShipments: ['SG-1002', 'SG-1005'],
    recommendedAction: 'Divert air cargo to Frankfurt Hub and hold vessel at Hamburg anchorage.'
  },
  {
    id: 'dis_3003',
    title: 'Thermal Excursion Critical Spike',
    location: 'Container #SG12345 (Mid-transit)',
    type: 'Cold Chain',
    severity: 'Critical',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
    startTime: '2026-03-14T10:15:30.000Z',
    expectedEnd: 'Immediate Action Required',
    timeAgo: '8 hours ago',
    affectedArea: 'Reefer Unit #RU-901 Telemetry Zone',
    description: 'Reefer cooling compressor power failure detected. Temperature spiked to 14.2°C (Allowed: 2.0°C to 8.0°C).',
    affectedShipments: ['SG-1008'],
    recommendedAction: 'Activate auxiliary generator unit and dispatch emergency technician at next checkpoint.'
  },
  {
    id: 'dis_3004',
    title: 'National Highway 53 Landslide',
    location: 'Mumbai-Pune Corridor',
    type: 'Road',
    severity: 'High',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
    startTime: '2026-03-13T14:00:00.000Z',
    expectedEnd: '2026-03-15T06:00:00.000Z',
    timeAgo: '1 day ago',
    affectedArea: 'NH-53 Mountain Pass Kilometer 84',
    description: 'Heavy rainfall triggered rockslide blocking dual lanes. Freight traffic rerouted to B12 Expressway.',
    affectedShipments: ['SG-1003'],
    recommendedAction: 'Instruct drivers to take State Highway 52 detour via Gwalior.'
  }
];

export const routesMockData = {
  currentScenario: {
    origin: 'Shanghai, China',
    destination: 'Mumbai, India',
    primaryRoute: {
      id: 'route_primary',
      name: 'Primary Ocean Corridor (via Singapore Strait)',
      distanceKm: 5870,
      durationHours: 206, // 8d 14h
      durationText: '8d 14h',
      costUsd: 4850,
      riskScore: 0.88,
      riskLevel: 'High',
      carrier: 'Global Logistics',
      availability: false,
      disruptionNote: 'Vulnerable to Singapore Port Congestion (dis_3001)',
      recommendation: 'Not Recommended'
    },
    recommendedRoute: {
      id: 'route_recommended',
      name: 'Southern Bypass Corridor (B12 Air-Land Multimodal)',
      distanceKm: 6120,
      durationHours: 144, // 6d 0h
      durationText: '6d 0h',
      costUsd: 5200,
      riskScore: 0.15,
      riskLevel: 'Low',
      carrier: 'Kuehne+Nagel / Express Air',
      availability: true,
      disruptionNote: 'Bypasses coastal storm and congested Straits',
      recommendation: 'RECOMMENDED'
    },
    alternativeRoutes: [
      {
        id: 'route_alt_1',
        name: 'Northern Overland Rail Corridor',
        distanceKm: 6450,
        durationHours: 264, // 11d 0h
        durationText: '11d 0h',
        costUsd: 4200,
        riskScore: 0.35,
        riskLevel: 'Medium',
        carrier: 'DB Schenker Rail',
        availability: true,
        recommendation: 'Alternative 1'
      },
      {
        id: 'route_alt_2',
        name: 'Direct Air Express Charter',
        distanceKm: 5100,
        durationHours: 18, // 18h
        durationText: '18h',
        costUsd: 12500,
        riskScore: 0.08,
        riskLevel: 'Very Low',
        carrier: 'DHL Air Charter',
        availability: true,
        recommendation: 'Alternative 2 (High Cost)'
      }
    ]
  }
};

export const fleetMockData = [
  {
    id: 'FL-001',
    name: 'Reefer Truck 01 (ColdGuard Heavy)',
    type: 'Truck',
    location: 'Mumbai Depot',
    status: 'Active',
    statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    utilization: 82,
    capacity: '20,000 kg',
    assignedShipment: 'SG-1001',
    driver: 'Rajesh Kumar',
    lastUpdated: '5 min ago'
  },
  {
    id: 'FL-002',
    name: 'Reefer Express Unit 02 (Idle Asset)',
    type: 'Truck',
    location: 'Pune Logistics Hub',
    status: 'Idle',
    statusBadge: 'bg-amber-100 text-amber-800 border-amber-200 font-bold',
    utilization: 0,
    capacity: '15,000 kg',
    assignedShipment: 'Unassigned',
    driver: 'Standby Crew A',
    lastUpdated: '12 min ago'
  },
  {
    id: 'FL-003',
    name: 'Express Vessel V-90 Container',
    type: 'Container',
    location: 'Singapore Terminal 4',
    status: 'Active',
    statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    utilization: 91,
    capacity: '30,000 kg',
    assignedShipment: 'SG-1004',
    driver: 'Captain V. Sharma',
    lastUpdated: '1 hr ago'
  },
  {
    id: 'FL-004',
    name: 'Heavy Duty Carrier 04',
    type: 'Truck',
    location: 'Delhi Freight Yard',
    status: 'Maintenance',
    statusBadge: 'bg-rose-100 text-rose-800 border-rose-200',
    utilization: 0,
    capacity: '18,000 kg',
    assignedShipment: 'None (In Shop)',
    driver: 'Mechanic Crew',
    lastUpdated: '2 hrs ago'
  },
  {
    id: 'FL-005',
    name: 'Air Cargo Container Pallet A1',
    type: 'Air',
    location: 'Frankfurt Airport',
    status: 'Active',
    statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    utilization: 75,
    capacity: '8,000 kg',
    assignedShipment: 'SG-1005',
    driver: 'Lufthansa Cargo',
    lastUpdated: '30 min ago'
  }
];

export const coldChainMockData = [
  {
    id: 'SG-1001',
    containerNo: 'CONT-84721',
    currentTemp: 4.2,
    targetMin: 2.0,
    targetMax: 8.0,
    status: 'Healthy',
    statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    lastReading: '2 min ago',
    trend: 'Stable (4.2°C)',
    location: 'Arabian Sea Corridor'
  },
  {
    id: 'SG-1007',
    containerNo: 'CONT-50912',
    currentTemp: 10.8,
    targetMin: 2.0,
    targetMax: 8.0,
    status: 'Warning',
    statusBadge: 'bg-amber-100 text-amber-800 border-amber-200',
    lastReading: '1 min ago',
    trend: 'Rising (+1.2°C/hr)',
    location: 'Malacca Strait'
  },
  {
    id: 'SG-1008',
    containerNo: 'CONT-12345',
    currentTemp: 14.2,
    targetMin: 2.0,
    targetMax: 8.0,
    status: 'Critical Excursion',
    statusBadge: 'bg-rose-100 text-rose-800 border-rose-200 font-bold',
    lastReading: '30 sec ago',
    trend: 'Spiking (+3.5°C/hr)',
    location: 'Mid-Pacific Transit Zone',
    excursionDuration: '45 minutes',
    excursionSeverity: 'Critical'
  }
];

export const temperatureHistoryChartData = [
  { time: '08:00', temp: 4.1, min: 2.0, max: 8.0 },
  { time: '08:30', temp: 4.3, min: 2.0, max: 8.0 },
  { time: '09:00', temp: 4.8, min: 2.0, max: 8.0 },
  { time: '09:30', temp: 6.2, min: 2.0, max: 8.0 },
  { time: '10:00', temp: 9.5, min: 2.0, max: 8.0 },
  { time: '10:15', temp: 12.1, min: 2.0, max: 8.0 },
  { time: '10:30', temp: 14.2, min: 2.0, max: 8.0 }
];

export const bobSuggestedQuestions = [
  "Which shipments are currently at highest risk?",
  "Why is shipment SG-1002 delayed?",
  "What is the best action for the Singapore port disruption?",
  "Which idle fleet assets can be redeployed?",
  "Which cold-chain shipment needs immediate attention?"
];

export const bobAnswersMock = {
  "Which shipments are currently at highest risk?": `Based on real-time disruption & thermal telemetry monitoring, **3 shipments** require immediate operational intervention:

1. **SG-1008** — 🚨 **Critical Temperature Excursion** (14.2°C vs safe range 2–8°C).
2. **SG-1002** — ⚠️ **Delayed** due to Rotterdam coastal storm surge.
3. **SG-1001** — ⚠️ **Strait Bottleneck** caused by Singapore Port Strike.

**Recommended Action**: Prioritize **SG-1008** for emergency cooling generator activation.`,

  "Why is shipment SG-1002 delayed?": `Shipment **SG-1002** (Dubai → Rotterdam) is delayed due to **Disruption dis_3002 (Severe Coastal Storm Surge)** in the North Sea approach channel.

- **Impact**: Vessel speed reduced to 6 knots for safety compliance.
- **Revised ETA**: May 5, 2025 (+48 hours).
- **Recommendation**: Divert high-priority cargo to Frankfurt Air Hub.`,

  "What is the best action for the Singapore port disruption?": `For **Disruption dis_3001 (Singapore Port Strike & Congestion)**:

- **Impact**: 48+ hour berth delay affecting shipments SG-1001 & SG-1004.
- **Recommended Bypass**: Reroute via **Southern Bypass Corridor (B12)** and redeploy idle Reefer Truck **FL-002** in Pune.
- **Benefit**: Saves 2.5 days ETA and avoids $4,800 congestion surcharge.`,

  "Which idle fleet assets can be redeployed?": `Currently **4 idle fleet assets** are available:

1. **FL-002** (Reefer Truck 02, 15,000 kg capacity) — Located in Pune Depot (**Recommended for SG-1001**).
2. **FL-006** (Standard Container Unit) — Located in Singapore Freight Yard.

**Optimization Score**: Redeploying **FL-002** increases overall fleet utilization from **78% to 84%**.`,

  "Which cold-chain shipment needs immediate attention?": `🚨 **SG-1008** requires **IMMEDIATE ATTENTION**:

- **Current Temp**: **14.2°C** (Safe Threshold: 2.0°C – 8.0°C).
- **Excursion Duration**: 45 minutes.
- **Risk**: Thermal degradation of pharmaceutical cargo.
- **Action**: Click 'Acknowledge Alert' on Cold Chain monitor to activate auxiliary cooling backup.`
};

export const reportsAnalyticsMock = {
  summary: {
    totalShipments: 48,
    onTimeDeliveryRate: '92%',
    averageDelayHours: '4.2 hrs',
    fleetUtilizationRate: '78%',
    coldChainHealthRate: '96%'
  },
  shipmentStatusDistribution: [
    { label: 'On Track', count: 32, percentage: 67, color: 'bg-emerald-500' },
    { label: 'Delayed', count: 5, percentage: 10, color: 'bg-amber-500' },
    { label: 'At Port', count: 4, percentage: 8, color: 'bg-sky-500' },
    { label: 'Delivered', count: 7, percentage: 15, color: 'bg-slate-500' }
  ],
  deliveryPerformanceTrend: [
    { date: 'Mon', rate: 89 },
    { date: 'Tue', rate: 91 },
    { date: 'Wed', rate: 88 },
    { date: 'Thu', rate: 94 },
    { date: 'Fri', rate: 92 },
    { date: 'Sat', rate: 95 },
    { date: 'Sun', rate: 92 }
  ],
  disruptionTrend: [
    { date: 'Mon', count: 1 },
    { date: 'Tue', count: 2 },
    { date: 'Wed', count: 4 },
    { date: 'Thu', count: 2 },
    { date: 'Fri', count: 3 },
    { date: 'Sat', count: 1 },
    { date: 'Sun', count: 3 }
  ]
};
