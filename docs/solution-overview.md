# Solution Overview

## What We Built
SupplyGuard AI is an AI-powered supply chain decision-support platform designed to protect shipments during severe disruptions, optimize regional fleet asset utilization, and detect cold-chain temperature excursions before cargo loss occurs.

## How It Works

1. **Data Ingestion:** Continuously ingests active shipment itineraries, disruption geofences (weather, strikes, road closures), fleet telematics, and IoT cold-chain sensor streams.
2. **Disruption & Impact Analysis:** Correlates shipment vectors against disruption zones to identify compromised or delayed cargo in real time.
3. **Alternative Rerouting & Fleet Optimization:** Evaluates alternative transit corridors to bypass bottlenecked areas and identifies nearby idle refrigerated fleet assets for dynamic redeployment.
4. **Cold-Chain Excursion Detection:** Tracks thermal sensor logs against safe operating thresholds (e.g., 2°C–8°C) and tags excursions with severity levels (`normal`, `warning`, `critical`).
5. **IBM Bob Conversational Decision Support:** Synthesizes operational metrics into natural-language risk summaries and prioritized, actionable recommendations for supply chain operators.

## Architecture Diagram

> See [`architecture.md`](architecture.md) for the detailed diagram.

```
[Data Feeds] → [Backend APIs] → [AI Analysis Engine] → [IBM Bob Assistant] → [Operator Dashboard]
                                       ↓
                                [MongoDB Store]
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Contract-First API & Schema Design | Enables 4 developers to build Frontend, Backend, AI, and Fleet modules independently without blocking dependencies |
| Deterministic vs. AI Logic Separation | Geofence math, route cost calculations, and temperature threshold checks are deterministic for reliability, while risk prioritization and reasoning use AI |
| MongoDB Persistence Layer | Flexible document schema natively handles dynamic IoT sensor streams, complex route waypoints, and disruption polygons |
| IBM Bob Integration | Provides a conversational decision-support assistant that answers complex operational queries in natural language |

## IBM Technologies Used

- **IBM Bob AI:** Provides conversational decision support, risk analysis rationale generation, and natural-language recommendation synthesis for logistics operators.
