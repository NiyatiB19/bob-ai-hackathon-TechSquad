# AI Module Specifications (`src/ai/`) — Module C (Member 3)

This directory hosts the AI decision-support logic, recommendation synthesis engines, prompt templates, and IBM Bob conversational services for **SupplyGuard AI**.

---

## 📁 Directory Architecture

- **`analyzers/`**:
  - `riskEngine.js`: Deterministic, explainable multi-factor shipment risk scoring ($0.00 \le \text{riskScore} \le 1.00$).
  - `disruptionEngine.js`: Maps disruption events to affected shipments, corridors, and regional impact zones.
- **`recommenders/`**:
  - `routeOptimizer.js`: Evaluates candidate alternative routes, distance deltas ($\Delta D$), delay reductions ($\Delta T$), and corridor risk ratings.
  - `fleetOptimizer.js`: Matches idle fleet assets from Module D with stranded shipments based on mode, capacity, proximity, and cold-chain fit.
  - `recommendationEngine.js`: High-level multi-criteria decision synthesizer generating prioritized operational actions.
- **`prompts/`**:
  - `bobPrompts.js`: Persona definitions and data-grounded prompt templates for IBM Bob queries.
- **`bob/`**:
  - `bobAdapter.js`: Context assembler and conversational synthesis wrapper for IBM Bob.
  - `IBM_BOB_GUIDE.md`: Operational and SDLC integration documentation for IBM Bob.
- **`services/`**:
  - `aiRecommendationService.js`: Service wrapper for `POST /api/ai/analyze`.
  - `bobService.js`: Service wrapper for `POST /api/bob/query`.
- **`mock/`**:
  - `mockData.json`: Off-line mock scenario contract for independent module testing.

---

## 🧮 AI & Deterministic Reasoning Logic

To maintain auditability and reliability:
1. **Deterministic Calculations:** Geofence intersections, thermal threshold checks ($\text{temp} > \text{allowedMax}$), proximity distance, and delay deltas are computed deterministically.
2. **AI Decision Synthesis:** Multi-factor risk scores, route recommendations, and natural-language rationales are synthesized on top of deterministic metrics.

---

## 🔌 API Endpoint Contracts

### Endpoint 1: `POST /api/ai/analyze`
- **Purpose:** Analyzes shipment state and returns multi-factor risk, route optimization, fleet matching, and prioritized recommendation envelope.
- **Request Payload:** `{ "shipmentId": "shp_2001" }`
- **Response Format:**
```json
{
  "success": true,
  "data": {
    "shipmentId": "shp_2001",
    "trackingNumber": "TRK-982341",
    "cargoType": "Pharmaceuticals (Vaccines)",
    "priority": "critical",
    "recommendation": {
      "recommendationId": "rec_2001_1773498930000",
      "type": "reroute_and_redeploy",
      "entityId": "shp_2001",
      "riskLevel": "critical",
      "riskScore": 0.95,
      "recommendation": "Reroute shipment shp_2001 via Southern Bypass Corridor (B12 / NH-52) and redeploy idle Reefer Reefer Truck 01 (ColdGuard Heavy Duty)",
      "reason": "Shipment shp_2001 (Pharmaceuticals (Vaccines)) is stranded by disruption Severe Coastal Blizzard & Flash Flood with active 14.2°C thermal excursion.",
      "expectedBenefit": "Prevents cargo spoilage by restoring thermal regulation within 1.2h and reduces delay by 14.5 hours.",
      "remainingRisk": "Minor delay during cargo transfer to asset flt_5001.",
      "confidence": 0.95
    }
  },
  "message": "AI analysis completed successfully."
}
```

### Endpoint 2: `POST /api/bob/query`
- **Purpose:** Processes dispatcher natural-language queries grounded in live/scenario project data.
- **Request Payload:** `{ "prompt": "What shipments are currently at highest risk?", "userId": "usr_1001" }`
- **Response Format:**
```json
{
  "success": true,
  "data": {
    "response": "Shipment shp_2001 (Pharmaceuticals (Vaccines)) is currently at CRITICAL risk (Score: 0.95)...",
    "structuredContext": {
      "primaryAffectedShipmentId": "shp_2001",
      "suggestedActionType": "reroute_and_redeploy",
      "recommendationId": "rec_2001_1773498930000",
      "riskLevel": "critical",
      "rationale": "Shipment shp_2001 is stranded by disruption dis_3001 with active 14.2°C thermal excursion."
    }
  },
  "message": "IBM Bob query processed successfully."
}
```

---

## 🧪 Testing

Run independent Module C test suite:
```bash
node tests/ai.test.js
```
