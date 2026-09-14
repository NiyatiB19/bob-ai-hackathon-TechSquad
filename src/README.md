# Source Code Directory (`src/`)

This directory will host the source code for the **SupplyGuard AI** application.

---

## Directory Structure

- **[`frontend/`](./frontend/)**:
  - Will contain the React frontend application built with Vite.
  - Will host UI/dashboard components, disruption maps, fleet status widgets, and the IBM Bob decision support interface.
  - Will consume backend REST APIs for real-time shipment, disruption, and cold-chain analytics.

- **[`backend/`](./backend/)**:
  - Will contain the Node.js / Express backend service layer.
  - Will expose API endpoints for shipment tracking, disruption analysis, fleet optimization, and cold-chain logs.
  - Will connect to the MongoDB database and interface with Python-based AI processing engines and IBM Bob services.

---

> **Note:** Application feature implementation will commence in Phase 2 following final alignment on shared API contracts and data models.
