# IBM Bob Integration & Operational Decision Support Guide — SupplyGuard AI

## 1. Overview & Strategic Role

In **SupplyGuard AI**, IBM Bob operates as an interactive AI decision-support engine and coding agent designed to assist supply chain managers and dispatchers during major disruptions.

Rather than relying on vague or hallucinated responses, IBM Bob integrates directly with SupplyGuard AI's deterministic risk scoring engines, route optimizers, fleet matchers, and cold-chain sensor streams.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. DISPATCHER PROMPT ("Which shipment requires immediate attention?")       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. BACKEND CONTEXT ASSEMBLY LAYER (src/ai/bob/bobAdapter.js)                │
│    - Fetches active shipments, disruptions, route status, & IoT sensors     │
│    - Invokes riskEngine.js, routeOptimizer.js, & fleetOptimizer.js          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. CONVERSATIONAL SYNTHESIS & STRUCTURED ACTION PAYLOAD                      │
│    - Generates natural-language operational guidance                        │
│    - Emits structured context payload for Frontend UI Action Buttons         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. IBM Bob Operational Modes in SupplyGuard AI

### A. Ask Mode (Operational Diagnosis & Code Base Understanding)
- Dispatchers query live supply chain status (e.g., *"What shipments are impacted by the coastal blizzard?"*).
- Developers inspect existing module contracts, API schemas, and mathematical scoring formulas.

### B. Plan Mode (Strategic Rerouting & Redeployment Planning)
- Synthesizes complex multi-factor scenarios (e.g., evaluating whether to reroute via Southern Corridor B12 vs. waiting for primary corridor clearance).

### C. Agent Mode (Action Execution & Rationale Synthesis)
- Formulates prioritized operational recommendations (`reroute_and_redeploy`, `redeploy_fleet`, `thermal_intervention`) with explicit quantitative benefits and remaining risk explanations.

---

## 3. Data Grounding & Contract Integration

IBM Bob queries consume Module B and Module D contracts directly:

- **Module B (Shipment + Disruption + Route):** Shipment tracking IDs, cargo priority, disruption severity, corridor availability.
- **Module C (AI Engine):** Deterministic risk scores, delay reduction hours, route risk ratings.
- **Module D (Fleet + Cold Chain):** Idle refrigerated asset locations, proximity distances, sensor thermal excursion readings (°C).

---

## 4. API Endpoints

IBM Bob decision support is exposed via standard REST API:

- **Endpoint:** `POST /api/bob/query`
- **Request Body:**
  ```json
  {
    "prompt": "What shipments are currently at highest risk?",
    "userId": "usr_1001"
  }
  ```
- **Response Format:**
  ```json
  {
    "success": true,
    "data": {
      "response": "Shipment shp_2001 (mRNA Vaccines) is currently at CRITICAL risk due to severe blizzard dis_3001 and an active thermal excursion (14.2°C vs 8.0°C max). Recommended Action: Deploy idle reefer flt_5001 located in Surat (15km away) and reroute via Southern Corridor B12.",
      "structuredContext": {
        "primaryAffectedShipmentId": "shp_2001",
        "suggestedActionType": "reroute_and_redeploy",
        "recommendationId": "rec_2001_1773498930000",
        "riskLevel": "critical",
        "rationale": "Shipment shp_2001 is stranded by blizzard dis_3001 with active 14.2°C thermal excursion."
      }
    },
    "message": "IBM Bob response generated successfully."
  }
  ```

---

## 5. Limitations & Implementation Honesty

1. **No External Unsupported REST SDK:** IBM Bob logic is executed via the repository's context assembly adapter (`bobAdapter.js`) and AI synthesis engine, grounding responses in project data models. No fake external HTTP SDKs or credentials are used.
2. **Deterministic Grounding:** All numeric risk scores, delay reductions, and proximity calculations are computed deterministically before AI synthesis.
