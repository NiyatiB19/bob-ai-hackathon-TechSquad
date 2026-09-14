# AI & Analytical Architecture Specifications — SupplyGuard AI

This document specifies the division between deterministic analytical calculations and AI reasoning models for **SupplyGuard AI**, alongside recommendation logic blueprints and cold-chain evaluation rules.

---

## 1. Separation of Deterministic Logic vs. AI Reasoning

To maintain reliability, accuracy, and auditability, SupplyGuard AI strictly separates deterministic mathematical computations from generative AI synthesis.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DETERMINISTIC / ANALYTICAL LAYER                         │
│  - Geofencing intersection (Shipment location vs Disruption polygon)        │
│  - Cold-chain threshold check (Temp < Min OR Temp > Max)                    │
│  - Fleet utilization ratio (Active Load / Max Capacity)                     │
│  - Route metric delta calculation (Distance, Cost, Delay hours)            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼ (Structured Analytical Metrics)
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AI REASONING & SYNTHESIS LAYER                         │
│  - Multi-factor Risk Scoring & Prioritization                               │
│  - Rerouting & Fleet Redeployment Strategy Recommendation                   │
│  - Natural-Language Rationale Generation                                    │
│  - IBM Bob Conversational Decision Support Synthesis                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Route Recommendation Logic

### Purpose
Evaluates alternative transit corridors when a primary route intersects an active disruption.

### Deterministic Inputs
- `shipmentLocation`: `{ lat, lng }`
- `destination`: `{ lat, lng }`
- `disruptionPolygon`: `Array<{ lat, lng }>`
- `availableRoutes`: List of registered `Route` documents

### Deterministic Calculation Steps
1. Filter out candidate routes that intersect the disruption polygon (`riskScore >= 0.8`).
2. Calculate delta distance: $\Delta D = \text{Distance}_{\text{alt}} - \text{Distance}_{\text{orig}}$.
3. Calculate delay reduction: $\Delta T = \text{Delay}_{\text{disrupted}} - \text{Transit}_{\text{alt}}$.

### Recommendation Output Schema (AI / Backend Interface)
```json
{
  "shipmentId": "shp_2001",
  "disruptionId": "dis_3001",
  "currentRouteId": "rte_4001",
  "recommendedRoute": {
    "routeId": "rte_4002",
    "routeName": "Southern Bypass Corridor (B12)",
    "distanceKm": 825.0,
    "additionalCostUSD": 280.0,
    "delayReductionHours": 14.5,
    "riskScore": 0.15
  },
  "confidenceScore": 0.95
}
```

---

## 3. Fleet Utilization & Redeployment Logic

### Purpose
Matches idle fleet assets with stranded shipments requiring emergency transport capacity.

### Deterministic Inputs
- `shipmentRequirement`: `{ location: { lat, lng }, requiredCapacityKg, refrigeratedRequired }`
- `fleetRegistry`: Array of `FleetAsset` documents where `status == "idle"`

### Deterministic Calculation Steps
1. Filter idle assets by mode compatibility (e.g., `truck` with `refrigerated == true`).
2. Compute Euclidean/Haversine distance from asset `currentLocation` to shipment `currentLocation`.
3. Rank idle assets by proximity and capacity fit.

### Recommendation Output Schema
```json
{
  "shipmentId": "shp_2001",
  "recommendedAsset": {
    "fleetAssetId": "flt_5001",
    "assetName": "ColdGuard Reefer Semi-Trailer T-408",
    "currentLocation": { "city": "Frankfurt", "lat": 50.1109, "lng": 8.6821 },
    "distanceToShipmentKm": 45.2,
    "estimatedDeploymentTimeHours": 1.2
  },
  "confidenceScore": 0.92
}
```

---

## 4. Cold-Chain Excursion Logic (Project-Defined Rules)

### Evaluation Rules
Cold-chain excursion evaluation is deterministic and governed by project-defined thermal safety thresholds.

- **Normal Condition:**
  $$\text{allowedMinTemp} \le \text{temperature} \le \text{allowedMaxTemp}$$
  *Severity:* `normal`

- **Warning Condition:**
  $$(\text{allowedMaxTemp} < \text{temperature} \le \text{allowedMaxTemp} + 3.0^\circ\text{C}) \quad \text{OR} \quad (\text{allowedMinTemp} - 2.0^\circ\text{C} \le \text{temperature} < \text{allowedMinTemp})$$
  *Severity:* `warning` (Excursion detected, minor thermal breach)

- **Critical Condition:**
  $$\text{temperature} > \text{allowedMaxTemp} + 3.0^\circ\text{C} \quad \text{OR} \quad \text{temperature} < \text{allowedMinTemp} - 2.0^\circ\text{C}$$
  *Severity:* `critical` (Immediate emergency breach, severe cargo spoilage risk)

### Calculation Schema Output
```json
{
  "readingId": "rdg_7001",
  "shipmentId": "shp_2001",
  "temperatureCelsius": 14.2,
  "allowedMinTemp": 2.0,
  "allowedMaxTemp": 8.0,
  "isExcursion": true,
  "severity": "critical",
  "actionRequired": "IMMEDIATE_REFRIGERATION_TRANSFER"
}
```

---

## 5. AI / Backend Contract Schemas

### Input Schema: Backend to AI Analysis Engine
```json
{
  "requestType": "ANALYZE_SHIPMENT_RISK",
  "shipment": {
    "shipmentId": "shp_2001",
    "cargoType": "mRNA Vaccines",
    "priority": "critical"
  },
  "analyticalMetrics": {
    "disruptionIntersected": true,
    "disruptionSeverity": "critical",
    "temperatureExcursion": true,
    "currentTemp": 14.2,
    "allowedMaxTemp": 8.0,
    "bestAlternativeRouteId": "rte_4002",
    "closestIdleAssetId": "flt_5001"
  }
}
```

### Output Schema: AI Analysis Engine to Backend
```json
{
  "recommendationId": "rec_8001",
  "type": "reroute_and_redeploy",
  "entityId": "shp_2001",
  "riskLevel": "critical",
  "recommendation": "Reroute shipment shp_2001 via Southern Corridor B12 and deploy idle Reefer flt_5001",
  "reason": "Shipment shp_2001 is stranded by blizzard dis_3001 with active 14.2°C thermal excursion. Route B12 avoids storm and idle asset flt_5001 is 45km away.",
  "confidence": 0.95,
  "createdAt": "2026-03-14T10:15:30.000Z"
}
```
