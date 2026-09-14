# Source Code Directory (`src/`)

Place all your project's source code in this folder.

## SupplyGuard AI Module Structure

Organized into 4 independent modules for 4 parallel developers:

```
src/
  frontend/       ← Module A (Member 1): React/Vite UI & Dashboard
  backend/        ← Modules B & D (Members 2 & 4): Node.js/Express API server & controllers
  ai/             ← Module C (Member 3): AI recommendation engine & IBM Bob services
```

## Structure Guidelines

Organize your code logically:

- **Frontend (`src/frontend/`):** UI components, pages, hooks, map widgets, and API clients.
- **Backend (`src/backend/`):** API controllers, services, Mongoose models, routes, and middleware.
- **AI (`src/ai/`):** AI recommendation analyzers, prompt templates, and IBM Bob conversational adapters.

## Important Files to Include

- `requirements.txt` or `package.json` — dependency manifest
- `.env.example` — template for environment variables (NEVER commit `.env`)
- Any database migration files
- Configuration files

## What NOT to Include in `src/`

- `.env` files with real secrets
- Large binary files (use Git LFS or link externally)
- `node_modules/` or `venv/` (these are in `.gitignore`)
- Build artifacts (`dist/`, `build/`, `__pycache__/`)
