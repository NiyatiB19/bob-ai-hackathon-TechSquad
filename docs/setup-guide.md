# Setup Guide

> **This file is read by the automated evaluation pipeline. Be precise and complete.**

## Prerequisites

Before you begin, ensure you have the following installed:

- [ ] Node.js (v18+ recommended)
- [ ] npm or yarn package manager
- [ ] Python 3.10+
- [ ] MongoDB (Local instance or Cloud MongoDB Atlas connection)
- [ ] IBM Bob account access and API key

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Required |
|---|---|---|
| `PORT` | Backend REST API server port (e.g., 5000) | Yes |
| `NODE_ENV` | Environment mode (`development` / `production`) | Yes |
| `MONGODB_URI` | MongoDB connection URI (`mongodb://localhost:27017/supplyguard_db`) | Yes |
| `BOB_API_URL` | IBM Bob AI API base endpoint URL | Yes |
| `BOB_API_KEY` | IBM Bob AI service credentials API key | Yes |
| `CORS_ORIGIN` | Allowed frontend client origin (`http://localhost:5173`) | Yes |

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/NiyatiB19/bob-ai-hackathon-TechSquad.git
cd bob-ai-hackathon-TechSquad

# 2. Configure environment variables
cp .env.example .env

# 3. Reference module structure
cat docs/development-workflow.md
```

## Running the Application

### Start the Backend

```bash
cd src/backend
npm install
npm run dev
## Running Tests

Independent module unit testing and mock data verification scripts:

```bash
# Verify shared mock data contracts
node -e "console.log(require('./src/backend/mock/mockData.json').scenario)"
```

## Quick Demo (Optional)

To inspect the offline mock data scenarios covering disruptions, cold-chain excursions, alternative routes, and idle fleet assets:

```bash
# View mock demonstration dataset
cat src/frontend/src/mock/mockData.json
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `MONGODB_URI` connection error | Ensure local MongoDB daemon is running (`mongod`) or update `MONGODB_URI` in `.env` to your cloud connection string |
| IBM Bob 401 Unauthorized | Check `BOB_API_KEY` and `BOB_API_URL` in `.env` file |
| CORS origin blocked | Ensure `CORS_ORIGIN` in `.env` matches the frontend server URL |
