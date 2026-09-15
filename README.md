# 🚀 SupplyGuard AI

AI-Powered Supply Chain Disruption Assistant & Fleet Utilisation Optimizer

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | [TechSquad] |
| **Track** | AI |
| **Team Lead** | [ Niyati Barochia] — [24dce009@charusat.edu.in] |
| **Members** | [Drashti Dedaniya], [Priyanshi Patel], [Palak Bhut] |

---

## 🎯 Problem Statement

Global supply chain disruptions—triggered by severe weather events, port strikes, and geopolitical crises—frequently impact hundreds of active shipments simultaneously. Logistics operators face extreme complexity when attempting to evaluate which shipments are affected, while primary corridors become bottlenecked and alternative transit routes suffer severe overloading.

Concurrently, fleet assets such as trucks, shipping containers, and transport vessels often sit idle in uninvolved locations due to fragmented communication and a lack of real-time operational visibility. Cold-chain shipments are particularly vulnerable to these delays; temperature excursions can easily spoil sensitive pharmaceuticals or food products, with breaches frequently remaining undetected until physical delivery.

Manual monitoring across disparate tracking portals, weather sensors, and IoT logs is slow, error-prone, and reactive. Supply chain operators require a unified, intelligent decision-support system capable of detecting disruptions early, recommending optimal rerouting, optimizing idle fleet deployment, and monitoring cold-chain conditions before cargo loss occurs.

---

## 💡 Solution

**SupplyGuard AI** is an AI-powered decision support platform designed to provide actionable intelligence for supply chain managers and fleet dispatchers.

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

---

## ✨ Key Features

- **Disruption Detection:** Continuous monitoring of environmental, labor, and regional disruption events affecting trade routes.
- **Affected Shipment Identification:** Rapid risk assessment and impact mapping for active shipments in impacted zones.
- **Route / Carrier Recommendation:** Intelligent alternative route generation and carrier selection to bypass disrupted corridors.
- **Fleet Utilisation Optimization:** Automated identification of idle trucks, containers, and vessels with redeployment suggestions.
- **Cold-Chain Monitoring:** Real-time logging and tracking of thermal conditions for temperature-sensitive cargo.
- **Temperature Excursion Detection:** Immediate detection of thermal spikes or drops exceeding cargo tolerance limits.
- **Severity Classification:** Categorization of temperature excursions to prioritize emergency interventions.
- **IBM Bob AI Decision Support:** Conversational AI decision-support interface providing clear, prioritized operational guidance for supply chain managers.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | JavaScript, Python |
| **Frameworks** | React, Node.js, Express.js, Vite |
| **IBM Technologies** | IBM Bob |
| **Databases** | MongoDB |
| **Other** | HTML5, CSS3, REST APIs |

---

## 📁 Repository Structure

```
SupplyGuard-AI/
├── .github/
│   └── workflows/
│       └── validate.yml           # Hackathon submission validation workflow
├── src/
│   ├── frontend/                  # React user interface application (Module A)
│   ├── backend/                   # Node.js/Express API service layer (Modules B & D)
│   ├── ai/                        # AI recommendation & IBM Bob engine (Module C)
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
│   ├── screenshots/               # Application screenshots guide
│   └── README.md                  # Overview of demo deliverables
├── presentation/                  # Slide deck directory
├── submission.yaml                # Structured submission metadata
└── CONTRIBUTING.md                # Submission guide & team development workflow
```

---

## ⚡ How to Run

```bash
# 1. Clone the repository
git clone https://github.com/NiyatiB19/bob-ai-hackathon-TechSquad.git
cd bob-ai-hackathon-TechSquad

# 2. Configure environment variables
cp .env.example .env

# 3. Reference setup guide for module execution
cat docs/setup-guide.md
```

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
| 📊 Presentation | [See presentation/](presentation/) |

---

## ⚠️ Known Limitations
  
The current submission focuses on the Phase 1-3 foundation, architecture,
    core workflows, and AI decision-support framework. Some advanced production
    capabilities, such as live external logistics data integration, real-time
    IoT sensor streaming, and large-scale optimization, would require further
    development and deployment infrastructure.

---

## 🏅 What We're Most Proud Of

 A modular, contract-first architecture that brings disruption intelligence,
    fleet utilization, and cold-chain monitoring together in one unified
    decision-support platform. We are especially proud of integrating IBM Bob
    as a conversational AI layer that can turn complex supply-chain conditions
    into prioritized, actionable operational recommendations.
