# Integration Contract & Architecture Decisions — SupplyGuard AI

This document specifies the integration blueprints for **IBM Bob**, mock data scenario standards, security/environment guidelines, and Architecture Decision Records (ADRs) for **SupplyGuard AI**.

---

## 1. IBM Bob Role & Integration Flow

### Strategic Role
IBM Bob serves as an interactive conversational decision-support assistant for supply chain dispatchers. It transforms complex, fragmented operational metrics into natural-language risk summaries and prioritized action items.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. USER PROMPT ("Which cold-chain shipment requires immediate attention?")   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. BACKEND CONTEXT ASSEMBLY LAYER                                           │
│    - Queries database for active disruptions, excursions, and fleet status  │
│    - Assembles normalized JSON payload of top 5 highest-risk shipments      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. STRUCTURED CONTEXT & PROMPT PIPELINE                                     │
│    - Combines System Persona Prompt + Normalized Supply Chain Metrics        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. IBM BOB CONVERSATIONAL REASONING ENGINE                                  │
│    - Synthesizes risk factors, rerouting options, and fleet proximity        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. ACTIONABLE RESPONSE TO OPERATOR DASHBOARD                                │
│    - Natural language answer + Structured Action Button Payload             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Supported Operational Capabilities & Queries
1. **Risk Identification:** *"What shipments are currently at highest risk?"*
2. **Disruption Root Cause Analysis:** *"Why is shipment shp_2001 affected?"*
3. **Alternative Rerouting Guidance:** *"What is the best action for the current disruption in the Rhine corridor?"*
4. **Asset Optimization:** *"Which idle fleet assets should be redeployed to assist stranded cargo?"*
5. **Cold-Chain Emergency Alerting:** *"Which cold-chain shipment requires immediate thermal intervention?"*

---

## 2. Mock Data Contract & Scenario Blueprint

To enable contract-first development across all 4 modules, a multi-event mock dataset is defined.

### Integrated Mock Scenario Definition
1. **Disruption Event:** Winter storm `dis_3001` strikes the Rhine highway corridor (A3).
2. **Affected Shipment:** Critical vaccine shipment `shp_2001` is immobilized in the storm zone.
3. **Cold-Chain Excursion:** Sensor `sns_6001` reports a thermal spike of `14.2°C` (exceeding `8.0°C` max).
4. **Alternative Route:** Southern bypass corridor `rte_4002` is open with low risk (`0.15`).
5. **Idle Fleet Asset:** Refrigerated semi-trailer `flt_5001` is idle in Frankfurt (`45km` away).

#### Scenario Contract JSON (`mock-scenario.json`)
```json
{
  "scenarioId": "scn_001",
  "name": "Rhine Blizzard & Vaccine Cold-Chain Emergency",
  "disruptions": [
    {
      "disruptionId": "dis_3001",
      "title": "Rhine Corridor Heavy Winter Storm",
      "severity": "critical",
      "status": "active"
    }
  ],
  "shipments": [
    {
      "shipmentId": "shp_2001",
      "trackingNumber": "TRK-982341",
      "cargoType": "mRNA Vaccines",
      "priority": "critical",
      "status": "inTransit",
      "disruptionId": "dis_3001",
      "temperatureSensitive": true
    }
  ],
  "routes": [
    { "routeId": "rte_4001", "routeName": "Primary Rhine Highway (A3)", "availability": false },
    { "routeId": "rte_4002", "routeName": "Southern Bypass (B12)", "availability": true }
  ],
  "fleetAssets": [
    { "fleetAssetId": "flt_5001", "assetName": "Reefer T-408", "status": "idle", "currentLocation": { "city": "Frankfurt" } }
  ],
  "coldChainAlerts": [
    { "readingId": "rdg_7001", "shipmentId": "shp_2001", "temperatureCelsius": 14.2, "severity": "critical" }
  ]
}
```

---

## 3. Security & Environment Configuration

All modules must consume environment variables via `.env` files. No hardcoded API keys or database connection strings are permitted in repository source code.

### Required Environment Variables (`.env.example`)
```bash
# Server Environment
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/supplyguard_db

# IBM Bob Integration Credentials
IBM_BOB_API_KEY=your_ibm_bob_api_key_here
IBM_BOB_SERVICE_URL=https://api.ibm.com/bob/v1

# Security & CORS Settings
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_development_jwt_secret
```

---

## 4. Architecture Decision Records (ADRs)

### ADR 1: Why MongoDB?
- **Decision:** Select MongoDB as the primary persistence layer.
- **Rationale:** Supply chain tracking data, weather polygon geofences, and IoT sensor streams have highly variable, hierarchical document structures. MongoDB provides flexible schema evolution and native geospatial indexing.
- **Alternatives Considered:** PostgreSQL (higher schema rigidity for dynamic IoT feeds).

### ADR 2: Why React & Vite?
- **Decision:** Use React with Vite for the frontend UI.
- **Rationale:** React provides component-based state management ideal for real-time dashboards and chat interfaces. Vite provides instant HMR development feedback.
- **Alternatives Considered:** Next.js (unnecessary SSR complexity for single-page operational dashboard).

### ADR 3: Why Node.js & Express?
- **Decision:** Use Node.js and Express for backend REST APIs.
- **Rationale:** Non-blocking asynchronous I/O is ideal for handling high-frequency sensor log ingestion and concurrent API calls.
- **Alternatives Considered:** Python Flask/FastAPI (used as sub-modules for specific AI math scripts, while Express serves as primary API gateway).

### ADR 4: Why Contract-First Development?
- **Decision:** Establish strict JSON schemas and API contracts prior to feature implementation.
- **Rationale:** Enables 4 developers to build frontend UI, backend APIs, AI algorithms, and cold-chain services simultaneously using mock data without blocking each other.
