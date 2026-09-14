# SupplyGuard AI

AI-Powered Supply Chain Disruption Assistant & Fleet Utilisation Optimizer

---

## Team

- **Team Name:** [TEAM NAME - TO BE FILLED]
- **Track:** AI
- **Team Lead:** [TEAM LEAD NAME - TO BE FILLED] ([TEAM LEAD EMAIL - TO BE FILLED])
- **Team Members:**
  - [MEMBER 1 NAME - TO BE FILLED] ([MEMBER 1 EMAIL - TO BE FILLED])
  - [MEMBER 2 NAME - TO BE FILLED] ([MEMBER 2 EMAIL - TO BE FILLED])
  - [MEMBER 3 NAME - TO BE FILLED] ([MEMBER 3 EMAIL - TO BE FILLED])

---

## Problem Statement

Global supply chain disruptions—triggered by severe weather events, port strikes, and geopolitical crises—frequently impact hundreds of active shipments simultaneously. Logistics operators face extreme complexity when attempting to evaluate which shipments are affected, while primary corridors become bottlenecked and alternative transit routes suffer severe overloading.

Concurrently, fleet assets such as trucks, shipping containers, and transport vessels often sit idle in uninvolved locations due to fragmented communication and a lack of real-time operational visibility. Cold-chain shipments are particularly vulnerable to these delays; temperature excursions can easily spoil sensitive pharmaceuticals or food products, with breaches frequently remaining undetected until physical delivery.

Manual monitoring across disparate tracking portals, weather sensors, and IoT logs is slow, error-prone, and reactive. Supply chain operators require a unified, intelligent decision-support system capable of detecting disruptions early, recommending optimal rerouting, optimizing idle fleet deployment, and monitoring cold-chain conditions before cargo loss occurs.

---

## Solution

**SupplyGuard AI** is a planned AI-powered decision support platform designed to provide actionable intelligence for supply chain managers and fleet dispatchers.

```
                SUPPLYGUARD AI
                      │
                      ▼
            React Web Application
                      │
                      ▼
            API / Backend Layer
                      │
    ┌─────────────────┼─────────────────┐
    ▼                 ▼                 ▼
Shipment Data    Disruption Data   Fleet Data
    │                 │                 │
    └─────────────────┼─────────────────┘
                      ▼
                AI / Analysis
                      │
    ┌─────────────────┼─────────────────┐
    ▼                 ▼                 ▼
 Routing           Fleet           Cold Chain
 Analysis       Optimization        Analysis
    │                 │                 │
    └─────────────────┼─────────────────┘
                      ▼
               IBM Bob AI Engine
                      │
                      ▼
               Recommendations
                      │
                      ▼
              Operator Dashboard
```

> **Note:** The above flow represents the finalized Phase 2 technical system architecture for SupplyGuard AI. Phase 2 establishes the complete architectural blueprint, database schemas, REST contracts, AI logic boundaries, and integration contracts prior to feature implementation in Phase 3.

---

## Key Features

1. **Disruption Detection:** Continuous monitoring of environmental, labor, and regional disruption events affecting trade routes.
2. **Affected Shipment Identification:** Rapid risk assessment and impact mapping for active shipments in impacted zones.
3. **Route / Carrier Recommendation:** Intelligent alternative route generation and carrier selection to bypass disrupted corridors.
4. **Fleet Utilisation Optimization:** Automated identification of idle trucks, containers, and vessels with redeployment suggestions.
5. **Cold-Chain Monitoring:** Real-time logging and tracking of thermal conditions for temperature-sensitive cargo.
6. **Temperature Excursion Detection:** Immediate detection of thermal spikes or drops exceeding cargo tolerance limits.
7. **Severity Classification:** Categorization of temperature excursions to prioritize emergency interventions.
8. **IBM Bob AI Decision Support:** Conversational AI decision-support interface providing clear, prioritized operational guidance for supply chain managers.

---

## Tech Stack

The following tech stack is planned for the SupplyGuard AI implementation:

- **Frontend:** React, Vite, HTML5 / CSS3 / JavaScript (or TypeScript)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI / Data Processing:** Python, machine learning / data processing libraries
- **IBM Integration:** IBM Bob conversational AI decision support

---

## How to Run

Implementation setup instructions will be added after the application is implemented in Phase 3.

---

## Demo

- **Live Demo URL:** NOT AVAILABLE YET
- **Demo Video Link:** NOT AVAILABLE YET
- **Screenshots:** NOT AVAILABLE YET

---

## Known Limitations

This repository currently represents **Phase 2: Complete Technical Architecture & Blueprint Setup**. The core application features, frontend interfaces, backend services, AI models, and IBM Bob integrations are fully designed and specified, and will be implemented in Phase 3.

---

## What We're Most Proud Of

This section will be updated after application implementation to highlight our key achievements and technical milestones.

---

## Project Structure

```
SupplyGuard-AI/
├── submission.yaml                # Official hackathon project & team metadata
├── README.md                      # Primary project overview documentation
├── CONTRIBUTING.md                # Collaboration guidelines and architecture principles
├── .gitignore                     # Git exclusion rules for secrets, dependencies & artifacts
├── .github/
│   └── workflows/
│       └── validate.yml           # Hackathon submission validation workflow
├── src/
│   ├── frontend/                  # Planned React user interface application (Module A)
│   ├── backend/                   # Planned Node.js/Express API service layer (Modules B, C & D)
│   └── README.md                  # Source code organization guide
├── docs/
│   ├── problem-statement.md       # In-depth Problem L2 analysis
│   ├── solution-overview.md       # Conceptual solution blueprint
│   ├── architecture.md            # Final system architecture & Mermaid diagrams
│   ├── database-schema.md         # Official MongoDB collections, fields & JSON schemas
│   ├── api-contract.md            # REST API endpoints, response envelopes & JSON contracts
│   ├── ai-architecture.md         # Analytical vs AI logic division & excursion rules
│   ├── integration-contract.md    # IBM Bob integration pipeline, mock scenario & ADRs
│   ├── development-workflow.md    # 4 independent module boundaries & git workflow rules
│   └── setup-guide.md             # Implementation setup template
├── demo/
│   ├── demo-video-link.txt        # Video submission URL placeholder
│   ├── live-demo-url.txt          # Live site URL placeholder
│   ├── screenshots/
│   │   └── README.md              # Application screenshot placeholders guide
│   └── README.md                  # Overview of demo deliverables
└── presentation/
    └── README.md                  # Final presentation outline guide
```
