# How to Submit Your Hackathon Entry

Follow these steps to set up your submission repository correctly.
The judges depend on this structure to review your entry — deviations may affect your score.

---

## Step 1 — Fork This Template

1. Click the **"Use this template"** button at the top of this repository
   (or **Fork** if you prefer)
2. Name your repository: `bob-ai-hackathon-[your-team-name]`
   (e.g., `bob-ai-hackathon-orion-squad`)
3. Set visibility to **Public** so judges can access it
4. Click **Create repository**

---

## Step 2 — Clone Your Fork Locally

```bash
git clone https://github.com/[your-org]/bob-ai-hackathon-[your-team-name].git
cd bob-ai-hackathon-[your-team-name]
```

---

## Step 3 — Fill in the Required Files

Work through these files in order:

### 3a. `submission.yaml` ← **Start here**
This is the most important file. Judges use it to get an overview of your entry.

- Open [`submission.yaml`](submission.yaml)
- Fill in **every field marked `# REQUIRED`**
- Read the inline comments — they explain what each field expects

### 3b. `README.md`
- Replace every `[placeholder in brackets]` with your actual content

### 3c. `docs/`
Fill in all four documentation files:
| File | What to write |
|---|---|
| [`docs/problem-statement.md`](docs/problem-statement.md) | The problem you're solving |
| [`docs/solution-overview.md`](docs/solution-overview.md) | How your solution works |
| [`docs/architecture.md`](docs/architecture.md) | Technical architecture diagram |
| [`docs/setup-guide.md`](docs/setup-guide.md) | Exact steps to run your project |

### 3d. `src/`
- Put all your source code inside [`src/`](src/)
- Copy [`src/.env.example`](src/.env.example) and add your environment variables to it
- **Never commit a real `.env` file** — it is already in `.gitignore`

### 3e. `demo/`
| File | What to do |
|---|---|
| [`demo/demo-video-link.txt`](demo/demo-video-link.txt) | Replace placeholder URL with your real video link |
| [`demo/live-demo-url.txt`](demo/live-demo-url.txt) | Add your deployed demo URL (or write "NOT DEPLOYED") |
| [`demo/screenshots/`](demo/screenshots/) | Add 3+ screenshots named `01-*.png`, `02-*.png`, etc. |

### 3f. `presentation/`
- Add your slide deck as [`presentation/slides.pdf`](presentation/) (preferred) or `.pptx`

---

## Step 4 — Verify Your Submission Passes Validation

Every push to your repository triggers the **Validate Submission** GitHub Action automatically.

To check manually:
1. Go to your repo on GitHub
2. Click the **Actions** tab
3. Look for **✅ Validate Submission**
4. A green checkmark means your submission is structurally complete
5. A red X means something is missing — click the run to see what

---

## Step 5 — Submit Your Repository URL

Once validation passes:

1. Copy your repository URL:
   `https://github.com/[your-org]/bob-ai-hackathon-[your-team-name]`

2. Submit it via the **official entry form** at the hackathon portal.

---

## Team Collaboration & Parallel Modular Development Guidelines

This project supports modular, parallel development across 4 team members. All contributors must follow the rules outlined below:

### 1. Independent Module Architecture
- **Module A (Member 1):** Frontend UI & mock API services (`src/frontend/`)
- **Module B (Member 2):** Shipment + Disruption + Route services (`src/backend/controllers/shipmentController.js`, `disruptionController.js`, `routeController.js`)
- **Module C (Member 3):** AI recommendation & IBM Bob services (`src/ai/**`, `aiController.js`, `bobController.js`)
- **Module D (Member 4):** Fleet + Cold-Chain services (`src/backend/controllers/fleetController.js`, `coldChainController.js`)

### 2. Contract-First Development
- All inter-module communication occurs via documented REST endpoints (`docs/api-contract.md`) and standard JSON envelopes (`{ success: true, data: {}, message: "" }`).
- Developers use mock datasets (`src/*/mock/mockData.json`) for offline testing prior to backend integration.

### 3. Git Branching Rules
- Work exclusively on your designated branch (`feature/frontend`, `feature/shipment-disruption`, `feature/ai-bob`, `feature/fleet-coldchain`).
- Submit Pull Requests to merge into `main`. Never push directly to `main`.
- Never commit real credentials or `.env` files.
