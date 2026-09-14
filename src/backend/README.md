# Module B Backend (`src/backend/`)

This backend implements the shipment, disruption, and route decision-support capability for SupplyGuard AI.

## Included functionality
- Shipment CRUD APIs
- Disruption CRUD APIs
- Affected-shipment detection
- Shipment risk assessment
- Alternative route recommendations
- Alternative carrier recommendations
- Demo / sample data for L2 scenarios
- Validation and consistent JSON error envelopes

## Key files
- `app.js` — Express server and route registration
- `services/affectedShipmentService.js` — deterministic disruption-impact matching
- `services/riskAssessmentService.js` — rule-based risk scoring
- `services/routeRecommendationService.js` — alternative route ranking
- `services/carrierRecommendationService.js` — carrier ranking
- `mock/sampleData.js` — demo/sample shipment and disruption data

## Runtime notes
- This is a backend prototype using in-memory sample data.
- It is intentionally independent from the frontend and the AI/Bob module.
- It is designed for hackathon demonstration and follow-up integration work.

## Core endpoints
- `GET /api/shipments`
- `GET /api/shipments/:id`
- `POST /api/shipments`
- `PUT /api/shipments/:id`
- `DELETE /api/shipments/:id`
- `GET /api/disruptions`
- `GET /api/disruptions/:id`
- `POST /api/disruptions`
- `PUT /api/disruptions/:id`
- `DELETE /api/disruptions/:id`
- `GET /api/shipments/affected`
- `GET /api/shipments/:id/risk`
- `POST /api/routes/recommend`
- `POST /api/carriers/recommend`

## Response contract
Success responses follow:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

Error responses follow:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required fields: shipmentId"
  }
}
```

## Assumptions and limitations
- Data is mock/demo data rather than a live operational database.
- Route and carrier ranking is deterministic and explainable, not AI-generated.
- The implementation is intentionally modular so Member 3 can consume the resulting risk data for IBM Bob.
