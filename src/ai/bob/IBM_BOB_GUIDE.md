# IBM Bob Integration & Operational Decision Support Guide — SupplyGuard AI

## 1. Overview & Strategic Role

In **SupplyGuard AI**, IBM Bob operates as an interactive AI decision-support engine and conversational assistant designed to assist supply chain managers and dispatchers during major disruptions, cold-chain emergencies, and fleet bottleneck events.

Rather than relying on ungrounded or hallucinated responses, IBM Bob integrates directly with SupplyGuard AI's deterministic risk scoring engines (`riskEngine.js`), route evaluators (`routeOptimizer.js`), fleet matchers (`fleetOptimizer.js`), and cold-chain thermal sensor streams (`coldChainService.js`).

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

## 2. Distinction Between Analytical AI vs. IBM Bob Decision Support

To maintain 100% auditability and data accuracy, SupplyGuard AI separates analytical computations from decision-support text synthesis:

| Layer | Component | Responsibility |
|---|---|---|
| **Deterministic Layer** | `riskEngine.js`, `disruptionEngine.js`, `routeOptimizer.js`, `fleetOptimizer.js` | Computes mathematical risk scores (0.0 to 1.0), distance deltas (km), delay reduction (hrs), and thermal excursion flags (`temp < min` OR `temp > max`). |
| **IBM Bob Decision Support** | `bobAdapter.js`, `bobService.js`, `bobPrompts.js` | Translates structured analytical metrics into natural-language dispatcher responses containing Situation, Risk, Rationale, Action, Expected Benefit, Remaining Risk, and Contingencies. |

---

## 3. Data Grounding & Anti-Hallucination Controls

IBM Bob responses consume live Module B and Module D entity contracts directly:

- **Module B (Shipment + Disruption + Route):** Shipment tracking IDs (`shp_2001`, `S102`), cargo types (`Vaccines`, `Pharmaceuticals`), disruption severity, corridor availability.
- **Module C (AI Engine):** Deterministic risk scores, delay reduction hours, route risk ratings.
- **Module D (Fleet + Cold Chain):** Idle refrigerated asset locations (`T14`, `flt_5001`), proximity distances (km), sensor thermal excursion readings (°C).

IBM Bob is strictly grounded in project data models and does **NOT** invent unrecorded shipment IDs, fake temperature readings, or non-existent fleet assets.

---

## 4. API Endpoints

IBM Bob decision support is exposed via standard REST API:

- **Endpoint:** `POST /api/bob/query`
- **Request Body:**
  ```json
  {
    "prompt": "Which cold-chain shipment is at highest risk and what idle truck is available?",
    "userId": "usr_1001"
  }
  ```
- **Response Format:**
  ```json
  {
    "success": true,
    "data": {
      "response": "🚨 Cold-Chain Emergency Analysis\n- Situation: Shipment S102 (Pharmaceuticals) is experiencing a thermal breach.\n- Current Sensor Log: 14.2°C (Required Safe Threshold: 2.0°C – 8.0°C).\n- Severity Level: CRITICAL.\n- Recommended Immediate Action: Reroute shipment S102 via Southern Bypass Corridor (B12) and redeploy idle Reefer T14.\n- Fleet Support: Deploy nearby idle refrigerated asset T14 (Location: Mumbai / Frankfurt).\n- Expected Benefit: Prevents cargo degradation by restoring thermal control within 1.2h.\n- Residual Risk: Brief exposure during cargo transfer.",
      "structuredContext": {
        "primaryAffectedShipmentId": "S102",
        "suggestedActionType": "reroute_and_redeploy",
        "recommendationId": "rec_S102_1773498930000",
        "riskLevel": "critical",
        "rationale": "Active thermal excursion logged for S102."
      }
    },
    "message": "IBM Bob query processed successfully."
  }
  ```

---

## 5. IBM Bob Setup & Authentication Requirements

1. **Trial Environment Configuration:** If an official IBM Bob Trial API key is available, set `BOB_API_KEY` and `BOB_API_URL` in `.env`:
   ```bash
   BOB_API_URL=https://api.ibm.com/bob/v1
   BOB_API_KEY=your_official_ibm_bob_api_key
   ```
2. **Context Assembly Engine:** When running in local development mode without external key configuration, SupplyGuard AI executes IBM Bob queries via the internal `bobAdapter.js` context assembler, ensuring 100% data-grounded responses without relying on unauthenticated remote calls.
