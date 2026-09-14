# Development Workflow & Module Boundaries — SupplyGuard AI

This document establishes the 4 independent module boundaries, Git branching strategy, and contract-first development guidelines for **SupplyGuard AI**.

---

## 1. The "Contract-First, Implementation-Second" Principle

To allow 4 developers to work concurrently in Phase 3 with zero blocking dependencies:
1. All database schemas (`docs/database-schema.md`), REST API contracts (`docs/api-contract.md`), and JSON schemas (`docs/ai-architecture.md`) are agreed upon prior to coding.
2. Developers mock external module responses using shared JSON datasets during initial development.
3. No developer may alter shared API schemas or entity fields without prior team consensus.

---

## 2. Four Independent Module Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MODULE A: FRONTEND UI                             │
│                  Owner: Developer 1 (Directory: src/frontend/)              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                    Uses Standard REST APIs & JSON Mocks
                                       │
    ┌──────────────────────────────────┼──────────────────────────────────┐
    ▼                                  ▼                                  ▼
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│   MODULE B: SHIPMENT  │  │   MODULE C: AI &      │  │ MODULE D: FLEET &     │
│   & DISRUPTION        │  │   IBM BOB             │  │ COLD CHAIN            │
│   Owner: Developer 2  │  │   Owner: Developer 3  │  │ Owner: Developer 4    │
│   (src/backend/b/)    │  │   (src/backend/c/)    │  │ (src/backend/d/)      │
└───────────────────────┘  └───────────────────────┘  └───────────────────────┘
```

---

### MODULE A: Frontend / User Interface
- **Primary Responsibility:** Builds the React/Vite dashboard user interface, interactive disruption maps, cold-chain alert banners, fleet management tables, and the IBM Bob conversational sidecar drawer.
- **Files Owned:**
  - `src/frontend/**`
- **APIs Consumed:**
  - `GET /api/shipments`, `GET /api/shipments/:id`
  - `GET /api/disruptions`, `GET /api/disruptions/:id`
  - `GET /api/routes`, `POST /api/routes/recommend`
  - `GET /api/fleet`, `POST /api/fleet/recommend`
  - `GET /api/cold-chain`, `GET /api/cold-chain/:shipmentId`
  - `POST /api/ai/analyze`, `POST /api/bob/query`
- **APIs Exposed:** None (Pure client-side consumer).
- **Shared Files Must NOT Modify:** `docs/*`, `.github/*`, `submission.yaml`.

---

### MODULE B: Shipment + Disruption Intelligence
- **Primary Responsibility:** Manages shipment itineraries, disruption geofencing event tracking, alternative route risk scoring, and rerouting calculation services.
- **Files Owned:**
  - `src/backend/controllers/shipmentController.js`
  - `src/backend/controllers/disruptionController.js`
  - `src/backend/controllers/routeController.js`
  - `src/backend/services/disruptionService.js`
  - `src/backend/services/routingService.js`
  - `src/backend/models/Shipment.js`, `Disruption.js`, `Route.js`
- **APIs Exposed:**
  - `GET /api/shipments`, `GET /api/shipments/:id`
  - `GET /api/disruptions`, `GET /api/disruptions/:id`
  - `GET /api/routes`, `POST /api/routes/recommend`
- **Inputs:** Raw shipment logs, weather geofence coordinates.
- **Outputs:** Evaluated shipment impact lists, alternative route rankings.

---

### MODULE C: AI + IBM Bob Integration
- **Primary Responsibility:** Synthesizes multi-factor operational data into structured AI recommendations, builds the IBM Bob prompt-context engine, and handles natural-language conversational queries.
- **Files Owned:**
  - `src/backend/controllers/aiController.js`
  - `src/backend/controllers/bobController.js`
  - `src/backend/services/aiRecommendationService.js`
  - `src/backend/services/bobService.js`
  - `src/backend/models/AIRecommendation.js`
  - `src/ai/**`
- **APIs Exposed:**
  - `POST /api/ai/analyze`
  - `POST /api/bob/query`
- **Inputs:** Normalized shipment risk, disruption severity, cold-chain excursion metrics.
- **Outputs:** Natural language explanations, structured recommendation objects.

---

### MODULE D: Fleet + Cold Chain Logistics
- **Primary Responsibility:** Tracks fleet asset utilization/idle status, processes IoT thermal sensor logs, detects temperature excursions, and assigns excursion severity levels.
- **Files Owned:**
  - `src/backend/controllers/fleetController.js`
  - `src/backend/controllers/coldChainController.js`
  - `src/backend/services/fleetService.js`
  - `src/backend/services/coldChainService.js`
  - `src/backend/models/FleetAsset.js`, `ColdChainSensor.js`, `TemperatureReading.js`
- **APIs Exposed:**
  - `GET /api/fleet`, `POST /api/fleet/recommend`
  - `GET /api/cold-chain`, `GET /api/cold-chain/:shipmentId`
- **Inputs:** Telemetry logs, fleet location updates.
- **Outputs:** Idle asset redeployment recommendations, temperature excursion alerts.

---

## 3. Git Branching & Workflow Rules

### Branch Architecture
```
main (Production / Shared Stable)
  │
  ├── feature/frontend            (Module A)
  ├── feature/shipment-disruption (Module B)
  ├── feature/ai-bob             (Module C)
  └── feature/fleet-coldchain     (Module D)
```

### Git Rules
1. **No Direct Pushes to `main`:** All code contributions must enter `main` via Pull Requests.
2. **Feature Branch Isolation:** Each developer works exclusively on their designated `feature/*` branch.
3. **Pull Request Peer Review:** PRs must be reviewed and tested against agreed API contracts before merging.
4. **Commit Conventions:** Use clear commit prefixes: `feat:`, `fix:`, `docs:`, `test:`.
