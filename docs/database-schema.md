# Database Schema Specifications — SupplyGuard AI

This document defines the official MongoDB collection schemas, data models, field types, relationships, indexes, and camelCase naming conventions for **SupplyGuard AI**.

---

## 1. Schema Overview & Naming Conventions

All collection document schemas adhere to MongoDB standards and use strict **camelCase** field identifiers.

### Primary References & Foreign Key Identifiers
To enable contract-first parallel development across all 4 modules, all entity IDs follow deterministic string formats:
- `userId`: `usr_1001`
- `shipmentId`: `shp_2001`
- `disruptionId`: `dis_3001`
- `routeId`: `rte_4001`
- `fleetAssetId`: `flt_5001`
- `sensorId`: `sns_6001`
- `readingId`: `rdg_7001`
- `recommendationId`: `rec_8001`

---

## 2. Collection Specifications

### Collection 1: `Users`
- **Purpose:** Stores user profiles and role-based permissions for logistics operators and fleet managers.
- **Indexes:** `{ email: 1 }` (Unique), `{ role: 1 }`

#### Fields Table
| Field | Type | Required | Description / Allowed Values |
| :--- | :--- | :--- | :--- |
| `userId` | String | Yes | Unique user ID identifier (`usr_1001`) |
| `name` | String | Yes | Full name of operator |
| `email` | String | Yes | Unique email address |
| `role` | String | Yes | `operator`, `fleetManager`, `coldChainManager`, `admin` |
| `createdAt` | Date / String | Yes | ISO 8601 creation timestamp |

#### Example Document
```json
{
  "userId": "usr_1001",
  "name": "Sarah Jenkins",
  "email": "sarah.jenkins@supplyguard.io",
  "role": "operator",
  "createdAt": "2026-03-01T08:00:00.000Z"
}
```

---

### Collection 2: `Shipments`
- **Purpose:** Tracks active shipments, origins, destinations, status, current location, and temperature sensitivity requirements.
- **Indexes:** `{ shipmentId: 1 }` (Unique), `{ status: 1 }`, `{ routeId: 1 }`, `{ disruptionId: 1 }`

#### Fields Table
| Field | Type | Required | Description / Allowed Values |
| :--- | :--- | :--- | :--- |
| `shipmentId` | String | Yes | Unique shipment identifier (`shp_2001`) |
| `trackingNumber` | String | Yes | Public tracking code (`TRK-982341`) |
| `origin` | Object | Yes | `{ city, country, lat, lng }` |
| `destination` | Object | Yes | `{ city, country, lat, lng }` |
| `currentLocation` | Object | Yes | `{ lat, lng, lastUpdated }` |
| `cargoType` | String | Yes | Cargo category (e.g., `Vaccines`, `Electronics`, `Produce`) |
| `priority` | String | Yes | `low`, `medium`, `high`, `critical` |
| `status` | String | Yes | `inTransit`, `delayed`, `rerouted`, `delivered`, `compromised` |
| `routeId` | String | Yes | Foreign key reference to `Routes` collection |
| `disruptionId` | String | Optional | Foreign key reference to active `Disruptions` collection |
| `estimatedDeparture` | Date / String | Yes | Scheduled departure timestamp |
| `estimatedArrival` | Date / String | Yes | Scheduled arrival timestamp |
| `temperatureSensitive` | Boolean | Yes | `true` if cold-chain monitoring is required |
| `requiredTemperatureRange` | Object | Optional | `{ min: Number, max: Number, unit: "C" }` |
| `createdAt` | Date / String | Yes | Record creation timestamp |

#### Example Document
```json
{
  "shipmentId": "shp_2001",
  "trackingNumber": "TRK-982341",
  "origin": { "city": "Rotterdam", "country": "Netherlands", "lat": 51.9244, "lng": 4.4777 },
  "destination": { "city": "Munich", "country": "Germany", "lat": 48.1351, "lng": 11.5820 },
  "currentLocation": { "lat": 50.6833, "lng": 6.1000, "lastUpdated": "2026-03-14T10:15:00.000Z" },
  "cargoType": "mRNA Vaccines",
  "priority": "critical",
  "status": "inTransit",
  "routeId": "rte_4001",
  "disruptionId": "dis_3001",
  "estimatedDeparture": "2026-03-13T06:00:00.000Z",
  "estimatedArrival": "2026-03-15T18:00:00.000Z",
  "temperatureSensitive": true,
  "requiredTemperatureRange": { "min": 2.0, "max": 8.0, "unit": "C" },
  "createdAt": "2026-03-12T12:00:00.000Z"
}
```

---

### Collection 3: `Disruptions`
- **Purpose:** Records active environmental, labor, and geopolitical disruption events impacting shipping corridors.
- **Indexes:** `{ disruptionId: 1 }` (Unique), `{ type: 1 }`, `{ severity: 1 }`, `{ status: 1 }`

#### Fields Table
| Field | Type | Required | Description / Allowed Values |
| :--- | :--- | :--- | :--- |
| `disruptionId` | String | Yes | Unique disruption identifier (`dis_3001`) |
| `title` | String | Yes | Short title (e.g., `Rhine Valley Severe Blizzard`) |
| `type` | String | Yes | `weather`, `portStrike`, `roadClosure`, `geopolitical`, `other` |
| `severity` | String | Yes | `low`, `medium`, `high`, `critical` |
| `location` | Object | Yes | `{ region, country, centerLat, centerLng }` |
| `affectedArea` | Object | Yes | `{ radiusKm: Number, polygonCoordinates: Array }` |
| `description` | String | Yes | Detailed operational summary of disruption |
| `startTime` | Date / String | Yes | Commencement timestamp of disruption |
| `expectedEndTime` | Date / String | Optional | Projected clearance timestamp |
| `status` | String | Yes | `active`, `monitoring`, `cleared` |
| `createdAt` | Date / String | Yes | Record creation timestamp |

#### Example Document
```json
{
  "disruptionId": "dis_3001",
  "title": "Rhine Corridor Heavy Winter Storm",
  "type": "weather",
  "severity": "critical",
  "location": { "region": "North Rhine-Westphalia", "country": "Germany", "centerLat": 50.7374, "centerLng": 7.0982 },
  "affectedArea": { "radiusKm": 120.0, "polygonCoordinates": [[50.1, 6.5], [51.2, 6.8], [51.0, 7.8], [50.0, 7.2]] },
  "description": "Blizzard condition blocking A3 motorway and freezing river barge freight.",
  "startTime": "2026-03-14T02:00:00.000Z",
  "expectedEndTime": "2026-03-16T12:00:00.000Z",
  "status": "active",
  "createdAt": "2026-03-14T02:30:00.000Z"
}
```

---

### Collection 4: `Routes`
- **Purpose:** Stores primary and alternative transit corridors for route comparisons and rerouting recommendations.
- **Indexes:** `{ routeId: 1 }` (Unique), `{ origin.city: 1, destination.city: 1 }`

#### Fields Table
| Field | Type | Required | Description / Allowed Values |
| :--- | :--- | :--- | :--- |
| `routeId` | String | Yes | Unique route identifier (`rte_4001`) |
| `routeName` | String | Yes | Human-readable route name |
| `origin` | Object | Yes | `{ city, country }` |
| `destination` | Object | Yes | `{ city, country }` |
| `waypoints` | Array | Yes | List of waypoint objects `[{ lat, lng, name }]` |
| `transportMode` | String | Yes | `road`, `rail`, `maritime`, `air` |
| `distanceKm` | Number | Yes | Total route distance in kilometers |
| `estimatedDurationHours` | Number | Yes | Estimated transit duration in hours |
| `estimatedCostUSD` | Number | Yes | Estimated transportation cost in USD |
| `riskScore` | Number | Yes | Risk rating score (0.0 = clear, 1.0 = blocked) |
| `availability` | Boolean | Yes | `true` if corridor is currently open |
| `carrier` | String | Yes | Logistics provider or carrier name |
| `createdAt` | Date / String | Yes | Record creation timestamp |

#### Example Document
```json
{
  "routeId": "rte_4001",
  "routeName": "Primary Rhine Highway Corridor (A3)",
  "origin": { "city": "Rotterdam", "country": "Netherlands" },
  "destination": { "city": "Munich", "country": "Germany" },
  "waypoints": [
    { "name": "Venlo", "lat": 51.3700, "lng": 6.1724 },
    { "name": "Cologne", "lat": 50.9375, "lng": 6.9603 }
  ],
  "transportMode": "road",
  "distanceKm": 780.5,
  "estimatedDurationHours": 9.5,
  "estimatedCostUSD": 1450.0,
  "riskScore": 0.92,
  "availability": false,
  "carrier": "EuroFreight Express",
  "createdAt": "2026-03-01T00:00:00.000Z"
}
```

---

### Collection 5: `FleetAssets`
- **Purpose:** Tracks vehicles, shipping containers, and transport vessels for idle asset detection and redeployment.
- **Indexes:** `{ fleetAssetId: 1 }` (Unique), `{ status: 1 }`, `{ transportMode: 1 }`

#### Fields Table
| Field | Type | Required | Description / Allowed Values |
| :--- | :--- | :--- | :--- |
| `fleetAssetId` | String | Yes | Unique asset identifier (`flt_5001`) |
| `assetName` | String | Yes | Asset label (e.g., `Reefer Semi-Trailer T-408`) |
| `transportMode` | String | Yes | `truck`, `container`, `vessel`, `railcar` |
| `capacity` | Object | Yes | `{ maxWeightKg: Number, volumeM3: Number, refrigerated: Boolean }` |
| `currentLocation` | Object | Yes | `{ city, country, lat, lng }` |
| `status` | String | Yes | `active`, `idle`, `maintenance`, `unavailable` |
| `utilizationPercentage` | Number | Yes | Current load percentage (0.0 to 100.0) |
| `assignedShipmentId` | String | Optional | Foreign key to `Shipments` (null if idle) |
| `lastUpdated` | Date / String | Yes | Status update timestamp |

#### Example Document
```json
{
  "fleetAssetId": "flt_5001",
  "assetName": "ColdGuard Reefer Semi-Trailer T-408",
  "transportMode": "truck",
  "capacity": { "maxWeightKg": 24000.0, "volumeM3": 85.0, "refrigerated": true },
  "currentLocation": { "city": "Frankfurt", "country": "Germany", "lat": 50.1109, "lng": 8.6821 },
  "status": "idle",
  "utilizationPercentage": 0.0,
  "assignedShipmentId": null,
  "lastUpdated": "2026-03-14T09:30:00.000Z"
}
```

---

### Collection 6: `ColdChainSensors`
- **Purpose:** Registers IoT sensor units attached to temperature-sensitive shipments.
- **Indexes:** `{ sensorId: 1 }` (Unique), `{ shipmentId: 1 }`

#### Fields Table
| Field | Type | Required | Description / Allowed Values |
| :--- | :--- | :--- | :--- |
| `sensorId` | String | Yes | Unique sensor unit identifier (`sns_6001`) |
| `shipmentId` | String | Yes | Foreign key reference to `Shipments` collection |
| `deviceModel` | String | Yes | Hardware model (e.g., `ThermoSense Pro IoT-X`) |
| `batteryStatus` | Number | Yes | Battery level percentage (0 to 100) |
| `targetTempMin` | Number | Yes | Minimum safe operating temperature (°C) |
| `targetTempMax` | Number | Yes | Maximum safe operating temperature (°C) |
| `isActive` | Boolean | Yes | `true` if sensor is actively transmitting |
| `createdAt` | Date / String | Yes | Sensor registration timestamp |

#### Example Document
```json
{
  "sensorId": "sns_6001",
  "shipmentId": "shp_2001",
  "deviceModel": "ThermoSense Pro IoT-X",
  "batteryStatus": 94,
  "targetTempMin": 2.0,
  "targetTempMax": 8.0,
  "isActive": true,
  "createdAt": "2026-03-13T05:30:00.000Z"
}
```

---

### Collection 7: `TemperatureReadings`
- **Purpose:** Logs chronological thermal sensor readings and tags detected excursions.
- **Indexes:** `{ readingId: 1 }` (Unique), `{ sensorId: 1, timestamp: -1 }`, `{ shipmentId: 1 }`, `{ isExcursion: 1 }`

#### Fields Table
| Field | Type | Required | Description / Allowed Values |
| :--- | :--- | :--- | :--- |
| `readingId` | String | Yes | Unique reading log identifier (`rdg_7001`) |
| `sensorId` | String | Yes | Foreign key reference to `ColdChainSensors` |
| `shipmentId` | String | Yes | Foreign key reference to `Shipments` |
| `timestamp` | Date / String | Yes | Measurement timestamp |
| `temperatureCelsius` | Number | Yes | Recorded temperature reading in °C |
| `allowedMinTemp` | Number | Yes | Threshold minimum temperature in °C |
| `allowedMaxTemp` | Number | Yes | Threshold maximum temperature in °C |
| `isExcursion` | Boolean | Yes | Evaluated flag: `true` if reading is out-of-bounds |
| `severity` | String | Yes | `normal`, `warning`, `critical` |

#### Example Document
```json
{
  "readingId": "rdg_7001",
  "sensorId": "sns_6001",
  "shipmentId": "shp_2001",
  "timestamp": "2026-03-14T10:14:00.000Z",
  "temperatureCelsius": 14.2,
  "allowedMinTemp": 2.0,
  "allowedMaxTemp": 8.0,
  "isExcursion": true,
  "severity": "critical"
}
```

---

### Collection 8: `AIRecommendations`
- **Purpose:** Stores generated decision-support recommendations produced by the AI engine and IBM Bob.
- **Indexes:** `{ recommendationId: 1 }` (Unique), `{ entityId: 1 }`, `{ riskLevel: 1 }`

#### Fields Table
| Field | Type | Required | Description / Allowed Values |
| :--- | :--- | :--- | :--- |
| `recommendationId` | String | Yes | Unique recommendation identifier (`rec_8001`) |
| `type` | String | Yes | `reroute`, `fleetRedeployment`, `coldChainAlert` |
| `entityId` | String | Yes | Targeted entity ID (`shp_2001` or `flt_5001`) |
| `riskLevel` | String | Yes | `low`, `medium`, `high`, `critical` |
| `recommendation` | String | Yes | High-level actionable recommendation title |
| `reason` | String | Yes | Detailed AI-generated rationale |
| `confidence` | Number | Yes | Confidence score rating (0.00 to 1.00) |
| `payload` | Object | Yes | Actionable payload `{ alternativeRouteId, redeployFleetAssetId }` |
| `createdAt` | Date / String | Yes | Record creation timestamp |

#### Example Document
```json
{
  "recommendationId": "rec_8001",
  "type": "reroute",
  "entityId": "shp_2001",
  "riskLevel": "critical",
  "recommendation": "Reroute shipment shp_2001 via Southern Corridor B12 and deploy idle Reefer flt_5001",
  "reason": "Shipment shp_2001 is stranded by severe winter storm dis_3001 with active 14.2°C thermal excursion. Corridor B12 bypasses blizzard with 3-hour lower delay.",
  "confidence": 0.95,
  "payload": {
    "alternativeRouteId": "rte_4002",
    "redeployFleetAssetId": "flt_5001"
  },
  "createdAt": "2026-03-14T10:15:30.000Z"
}
```
