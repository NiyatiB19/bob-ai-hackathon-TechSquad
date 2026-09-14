# Contributing Guidelines — SupplyGuard AI

Welcome to the **SupplyGuard AI** project for the IBM Bob AI Hackathon 2026.

This project is designed to support modular, parallel development across 4 team members. To maintain code quality, clarity, and consistency, all contributors must follow the principles and workflow outlined below.

---

## 1. Core Development Principles

1. **Independent Module Architecture:**
   - Frontend, backend, AI data processing, and IBM Bob integration modules must remain cleanly separated with distinct boundaries.
   - No team member's module should depend on another member's internal implementation details.
   - All cross-module interactions must take place strictly via documented REST APIs, JSON schemas, or clear interface contracts.

2. **Pre-Implementation Alignment:**
   Before coding features in Phase 2, the team will formally agree upon:
   - Data models & entity schemas (Shipments, Disruptions, Fleet Assets, IoT Logs)
   - REST API endpoint contracts & payload shapes
   - Shared input/output file formats
   - Git branching & commit conventions

3. **Code Quality Standards:**
   - **No Hardcoded Credentials:** Never check secrets, API keys, or database URIs into git. Always use environment variables (`.env`).
   - **No Fake Functional Claims:** Do not commit hardcoded mock responses as working AI models or backend functionality.
   - **Clean Directory Hygiene:** Keep all files in their designated directories.
   - **Self-Documenting Code:** Write clear docstrings and comments for core functions and interfaces.

---

## 2. Shared Interfaces & Module Boundaries

| Module | Responsibility | Primary Directory |
| :--- | :--- | :--- |
| **Frontend UI** | User dashboard, interactive maps, excursion alerts, decision support UI | `src/frontend/` |
| **Backend API** | API routes, data persistence, disruption scoring, alert routing | `src/backend/` |
| **AI Engine** | Disruption mapping, alternative route recommendation, fleet optimization | `src/backend/` / `src/ai/` |
| **IBM Bob Assistant** | Conversational support engine, decision rationale generation | `src/backend/` |

---

## 3. Git Branching Strategy

- **`main`**: Production-ready, stable codebase.
- **`feature/<module-name>`**: Dedicated feature branches created per task after team alignment.
- **Pull Requests:** All changes to `main` must be submitted via Pull Request with code review by at least one team member.

---

## 4. Environment Safety

- Ensure `.env` is listed in `.gitignore`.
- Provide environment variable templates (`.env.example`) when adding new required settings.
