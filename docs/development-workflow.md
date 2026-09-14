# Development Workflow & Parallel Execution Specifications — SupplyGuard AI

This document defines the 4-member module ownership, Git branching strategy, cross-module integration rules, and contract-first execution guidelines for **SupplyGuard AI**.

---

## 1. Module Ownership Matrix

| Module | Assigned Owner | Primary Directories / Owned Files | Primary APIs / Responsibilities |
| :--- | :--- | :--- | :--- |
| **MODULE A** | **Member 1** | `src/frontend/**` | Frontend UI, Dashboard, Map overlays, Alert cards, IBM Bob Chat UI, API client integration |
| **MODULE B** | **Member 2** | `src/backend/controllers/shipmentController.js`<br>`src/backend/controllers/disruptionController.js`<br>`src/backend/controllers/routeController.js`<br>`src/backend/services/shipmentService.js`<br>`src/backend/models/Shipment.js`, `Disruption.js`, `Route.js` | `GET /api/shipments`, `GET /api/disruptions`, `GET /api/routes`, `POST /api/routes/recommend` |
| **MODULE C** | **Member 3** | `src/ai/**`<br>`src/backend/controllers/aiController.js`<br>`src/backend/controllers/bobController.js`<br>`src/backend/services/aiRecommendationService.js`, `bobService.js`<br>`src/backend/models/AIRecommendation.js` | `POST /api/ai/analyze`, `POST /api/bob/query`<br>AI decision-support synthesis & IBM Bob conversational engine |
| **MODULE D** | **Member 4** | `src/backend/controllers/fleetController.js`<br>`src/backend/controllers/coldChainController.js`<br>`src/backend/services/fleetService.js`, `coldChainService.js`<br>`src/backend/models/FleetAsset.js`, `ColdChainSensor.js`, `TemperatureReading.js` | `GET /api/fleet`, `POST /api/fleet/recommend`<br>`GET /api/cold-chain`, `GET /api/cold-chain/:shipmentId` |

---

## 2. Git Branch Strategy & Workflow Rules

### Branch Architecture
- **`main`**: Protected integration branch. **No direct commits allowed on `main`.**
- **`feature/frontend`**: Owned by Member 1 (Module A)
- **`feature/shipment-disruption`**: Owned by Member 2 (Module B)
- **`feature/ai-bob`**: Owned by Member 3 (Module C)
- **`feature/fleet-coldchain`**: Owned by Member 4 (Module D)

### Recommended Commit Message Conventions
Developers must use standard feature scope prefixes:
- `feat(frontend): create dashboard shell`
- `feat(shipments): add shipment service`
- `feat(disruptions): add disruption analysis`
- `feat(ai): add recommendation synthesis`
- `feat(bob): add Bob client wrapper`
- `feat(fleet): add fleet utilization analysis`
- `feat(cold-chain): add excursion detector`

### Pull Request & Merge Guidelines
1. Work is committed in small, logical commits on the assigned `feature/*` branch.
2. Before opening a PR to merge into `main`, the developer must run independent unit/mock tests for their module.
3. Pull Requests require approval from at least one peer developer.
4. Avoid modifying files outside your assigned module directory unless an agreed cross-module interface change is required.

---

## 3. Shared Identifiers & Contracts

All database collections, REST payloads, and JSON mocks must consistently use these **camelCase** identifiers:
- `userId`
- `shipmentId`
- `disruptionId`
- `routeId`
- `fleetAssetId`
- `sensorId`
- `readingId`
- `recommendationId`

---

## 4. Cross-Module Data Flows

### Flow 1: Disrupted Shipment Analysis
```
Shipment Data ──> Module B (Disruption Impact Scorer) ──> Risk Metrics ──> Module C (AI Engine) ──> IBM Bob Rationale ──> Module A (Frontend UI)
```

### Flow 2: Fleet Redeployment Opportunity
```
Shipment Need + Idle Assets ──> Module D (Fleet Suitability Engine) ──> Redeployment Candidate ──> Module C (AI Engine) ──> Module A (Frontend UI)
```

### Flow 3: Cold-Chain Excursion Alerting
```
Sensor Telemetry ──> Module D (Excursion Detector) ──> Severity Tag ──> Module C (Risk Synthesizer) ──> Module A (Frontend UI Banner)
```

### Flow 4: Alternative Route Evaluation
```
Stranded Shipment ──> Module B (Route Evaluator) ──> Corridor Candidates ──> Module C (AI Engine) ──> Module A (Frontend UI Map)
```

---

## 5. Independent Testing Sequence

To ensure stable integration, testing follows a phased sequence:

```
[ Module B Tests ] + [ Module D Tests ]
              │
              ▼
       [ Module C Tests ]
              │
              ▼
     [ Backend API Envelopes ]
              │
              ▼
       [ Module A UI Tests ]
              │
              ▼
   [ IBM Bob Live Integration ]
```

---

## 6. Shared File Rules & Conflict Resolution

- **Shared Configuration Files:** (`submission.yaml`, `README.md`, `.gitignore`, `.env.example`, `.github/workflows/validate.yml`) should only be modified after notifying team members.
- **Conflict Avoidance:** Keep commits focused strictly on your owned module files (`src/frontend/`, `src/backend/controllers/shipmentController.js`, etc.).
