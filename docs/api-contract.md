# REST API Contract Specifications — SupplyGuard AI

This document establishes the official REST API endpoint contracts, request/response payload schemas, standard JSON envelopes, and responsible module ownership for **SupplyGuard AI**.

---

## 1. Standard API Response Envelope

To enforce contract-first development, all HTTP responses from backend endpoints must adhere strictly to these envelope structures.

### Standard Success Response Format (HTTP 200 / 201)
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

### Standard Error Response Format (HTTP 400 / 404 / 500)
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested shipment ID shp_9999 does not exist."
  }
}
```

---

## 2. API Endpoint Catalog

---

### Endpoint 1: `GET /api/shipments`
- **Purpose:** Retrieves a list of active shipments with optional filter query parameters.
- **Module Owner:** **Module B** (Shipment + Disruption)
- **Query Parameters:** `status` (optional), `priority` (optional), `disruptionId` (optional)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "shipments": [
      {
        "shipmentId": "shp_2001",
        "trackingNumber": "TRK-982341",
        "origin": { "city": "Rotterdam", "country": "Netherlands" },
        "destination": { "city": "Munich", "country": "Germany" },
        "cargoType": "mRNA Vaccines",
        "priority": "critical",
        "status": "inTransit",
        "routeId": "rte_4001",
        "disruptionId": "dis_3001",
        "temperatureSensitive": true
      }
    ],
    "totalCount": 1
  },
  "message": "Shipments retrieved successfully."
}
```

---

### Endpoint 2: `GET /api/shipments/:id`
- **Purpose:** Retrieves complete detailed record for a specific shipment.
- **Module Owner:** **Module B** (Shipment + Disruption)
- **Parameters:** `id` (e.g., `shp_2001`)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "shipment": {
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
      "requiredTemperatureRange": { "min": 2.0, "max": 8.0, "unit": "C" }
    }
  },
  "message": "Shipment details retrieved successfully."
}
```

---

### Endpoint 3: `GET /api/disruptions`
- **Purpose:** Fetches all active environmental, labor, and geopolitical disruption events.
- **Module Owner:** **Module B** (Shipment + Disruption)
- **Query Parameters:** `severity` (optional), `status` (optional)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "disruptions": [
      {
        "disruptionId": "dis_3001",
        "title": "Rhine Corridor Heavy Winter Storm",
        "type": "weather",
        "severity": "critical",
        "location": { "region": "North Rhine-Westphalia", "country": "Germany" },
        "affectedArea": { "radiusKm": 120.0 },
        "description": "Blizzard condition blocking A3 motorway.",
        "startTime": "2026-03-14T02:00:00.000Z",
        "status": "active"
      }
    ]
  },
  "message": "Active disruptions retrieved."
}
```

---

### Endpoint 4: `GET /api/disruptions/:id`
- **Purpose:** Retrieves full disruption impact details and affected shipment lists.
- **Module Owner:** **Module B** (Shipment + Disruption)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "disruption": {
      "disruptionId": "dis_3001",
      "title": "Rhine Corridor Heavy Winter Storm",
      "type": "weather",
      "severity": "critical",
      "affectedShipmentIds": ["shp_2001", "shp_2004"]
    }
  },
  "message": "Disruption impact details retrieved."
}
```

---

### Endpoint 5: `GET /api/routes`
- **Purpose:** Fetches registered transit corridors and alternative route options.
- **Module Owner:** **Module B** (Shipment + Disruption)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "routeId": "rte_4001",
        "routeName": "Primary Rhine Highway Corridor (A3)",
        "origin": { "city": "Rotterdam" },
        "destination": { "city": "Munich" },
        "transportMode": "road",
        "distanceKm": 780.5,
        "riskScore": 0.92,
        "availability": false
      },
      {
        "routeId": "rte_4002",
        "routeName": "Southern Bypass Corridor (B12)",
        "origin": { "city": "Rotterdam" },
        "destination": { "city": "Munich" },
        "transportMode": "road",
        "distanceKm": 825.0,
        "riskScore": 0.15,
        "availability": true
      }
    ]
  },
  "message": "Routes retrieved successfully."
}
```

---

### Endpoint 6: `POST /api/routes/recommend`
- **Purpose:** Evaluates rerouting options for a compromised shipment.
- **Module Owner:** **Module B** (Shipment + Disruption)

#### Request Body
```json
{
  "shipmentId": "shp_2001",
  "disruptionId": "dis_3001"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "shipmentId": "shp_2001",
    "currentRouteId": "rte_4001",
    "recommendedRoute": {
      "routeId": "rte_4002",
      "routeName": "Southern Bypass Corridor (B12)",
      "distanceKm": 825.0,
      "additionalCostUSD": 280.0,
      "delayReductionHours": 14.5,
      "riskScore": 0.15
    },
    "reason": "Bypasses blizzard area dis_3001 with 14.5h delay reduction."
  },
  "message": "Route recommendation generated."
}
```

---

### Endpoint 7: `GET /api/fleet`
- **Purpose:** Retrieves list of fleet assets and their utilization status.
- **Module Owner:** **Module D** (Fleet + Cold Chain)
- **Query Parameters:** `status` (optional, e.g. `idle`), `transportMode` (optional)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "fleetAssetId": "flt_5001",
        "assetName": "ColdGuard Reefer Semi-Trailer T-408",
        "transportMode": "truck",
        "currentLocation": { "city": "Frankfurt", "lat": 50.1109, "lng": 8.6821 },
        "status": "idle",
        "utilizationPercentage": 0.0,
        "capacity": { "refrigerated": true }
      }
    ]
  },
  "message": "Fleet assets retrieved successfully."
}
```

---

### Endpoint 8: `POST /api/fleet/recommend`
- **Purpose:** Identifies idle fleet assets to redeploy for affected shipments.
- **Module Owner:** **Module D** (Fleet + Cold Chain)

#### Request Body
```json
{
  "shipmentId": "shp_2001",
  "requiredCapacityKg": 15000,
  "refrigeratedRequired": true
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "shipmentId": "shp_2001",
    "recommendedAsset": {
      "fleetAssetId": "flt_5001",
      "assetName": "ColdGuard Reefer Semi-Trailer T-408",
      "currentLocation": { "city": "Frankfurt" },
      "distanceToShipmentKm": 45.2,
      "estimatedDeploymentTimeHours": 1.2
    },
    "reason": "Idle refrigerated asset located 45km from stranded shipment location."
  },
  "message": "Fleet redeployment recommendation generated."
}
```

---

### Endpoint 9: `GET /api/cold-chain`
- **Purpose:** Returns cold-chain telemetry metrics and active thermal excursion alerts.
- **Module Owner:** **Module D** (Fleet + Cold Chain)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "activeAlerts": [
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
    ]
  },
  "message": "Cold-chain alert telemetry retrieved."
}
```

---

### Endpoint 10: `GET /api/cold-chain/:shipmentId`
- **Purpose:** Fetches historical sensor readings for a specific shipment.
- **Module Owner:** **Module D** (Fleet + Cold Chain)

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "shipmentId": "shp_2001",
    "sensor": {
      "sensorId": "sns_6001",
      "targetTempMin": 2.0,
      "targetTempMax": 8.0
    },
    "readings": [
      { "timestamp": "2026-03-14T10:00:00.000Z", "temperatureCelsius": 4.5, "severity": "normal" },
      { "timestamp": "2026-03-14T10:14:00.000Z", "temperatureCelsius": 14.2, "severity": "critical" }
    ]
  },
  "message": "Shipment telemetry history retrieved."
}
```

---

### Endpoint 11: `POST /api/ai/analyze`
- **Purpose:** Synthesizes disruption, fleet, and cold-chain data into AI recommendations.
- **Module Owner:** **Module C** (AI + IBM Bob)

#### Request Body
```json
{
  "shipmentId": "shp_2001"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "recommendation": {
      "recommendationId": "rec_8001",
      "type": "reroute",
      "entityId": "shp_2001",
      "riskLevel": "critical",
      "recommendation": "Reroute shipment shp_2001 via Southern Corridor B12 and deploy idle Reefer flt_5001",
      "reason": "Stranded by dis_3001 with active 14.2°C thermal excursion.",
      "confidence": 0.95,
      "createdAt": "2026-03-14T10:15:30.000Z"
    }
  },
  "message": "AI analysis complete."
}
```

---

### Endpoint 12: `POST /api/bob/query`
- **Purpose:** Handles conversational queries from the operator via IBM Bob.
- **Module Owner:** **Module C** (AI + IBM Bob)

#### Request Body
```json
{
  "prompt": "What shipments are currently at highest risk and what action should I take?",
  "userId": "usr_1001"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "response": "Shipment shp_2001 (mRNA Vaccines) is currently at CRITICAL risk due to blizzard dis_3001 and an active thermal excursion (14.2°C vs 8.0°C max). Recommended Action: Deploy idle reefer flt_5001 located in Frankfurt (45km away) and reroute via Southern Corridor B12.",
    "structuredContext": {
      "primaryAffectedShipmentId": "shp_2001",
      "suggestedActionType": "reroute_and_redeploy",
      "recommendationId": "rec_8001"
    }
  },
  "message": "IBM Bob response generated successfully."
}
```
