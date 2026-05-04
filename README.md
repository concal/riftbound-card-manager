# Riftbound Collection Manager

A personal card collection manager for Riftbound TCG. Search for cards by name, track your collection, and view live market prices powered by the TCGPlayer API.

## Features

- **Card Search** — Search cards by name and browse results with card art and pricing
- **Collection Tracking** — Add cards to your personal collection stored in MongoDB
- **Live Pricing** — Fetches and caches market prices from TCGPlayer via the TCGAPI
- **Filtering & Sorting** — Filter your collection by name or price range, sort by price or name
- **Authentication** — Email/password auth via [better-auth](https://better-auth.com)
- **Responsive UI** — Mobile-friendly layout with a bottom nav on small screens

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Hono on Node.js |
| Database | MongoDB (collections), SQLite (auth sessions) |
| Auth | better-auth |
| UI Components | shadcn/ui, Lucide React |
| Card Data | [TCGAPI](https://tcgapi.dev) |

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB cluster
- A [TCGAPI](https://tcgapi.dev) API key

### Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description |
   |---|---|
   | `TCGAPI_KEY` | Your TCGAPI API key |
   | `BETTER_AUTH_SECRET` | Random secret for session signing (generate with `openssl rand -base64 32`) |
   | `BETTER_AUTH_URL` | Base URL of the backend server |
   | `MONGODB_URI` | MongoDB connection string |

3. Start the development servers (client + server run concurrently):
   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start both client and server with hot reload |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start Hono server only |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |

## Architecture

The backend is a Hono server that serves two purposes:

1. **API proxy** — Forwards requests to TCGAPI with the secret API key injected server-side, keeping the key out of the browser. Bulk TCGPlayer ID resolution is handled with in-memory caching and automatic chunking to stay within the TCGAPI 100-item batch limit.
2. **App API** — REST endpoints for managing collections (`/api/collections`) and user preferences (`/api/preferences`), backed by MongoDB.

Authentication is handled by better-auth with email/password, using a local SQLite database for session storage.
