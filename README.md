# TravelSpot Backend

REST API for the TravelSpot application — a travel destination discovery platform. Built with **Express 5**, **TypeScript**, and **MongoDB**.

## Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js (via `tsx` for dev, compiled JS for production) |
| Framework | Express 5 |
| Language | TypeScript 7 |
| Database | MongoDB 7 (native driver, no ODM) |
| Module system | CommonJS |
| Deployment | Vercel (serverless, `@vercel/node`) |

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB instance (Atlas or local)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string and database name

# 3. Start dev server (auto-restart on changes)
npm run dev
```

The server starts at `http://localhost:5000` by default (configurable via `PORT` env).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name |
| `PORT` | Server port (default `5000`) |

## API Endpoints

### Places

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/places` | List all places |
| `GET` | `/api/places/:id` | Get a single place (includes creator info via `$lookup`) |
| `GET` | `/api/places/user/:id` | Get all places by a specific user |
| `POST` | `/api/places` | Create a new place |
| `DELETE` | `/api/places/:id` | Delete a place |

### Users

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/:id` | Get a single user |

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |

## Scripts

```bash
npm run dev     # Development with hot-reload (tsx watch)
npm run build   # Compile TypeScript to dist/
npm run start   # Run compiled production build
```

## Project Structure

```
.
├── server.ts          # Entrypoint — Express app, routes, MongoDB connection
├── tsconfig.json      # TypeScript config (nodenext module resolution)
├── vercel.json        # Vercel deployment config
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variable template
├── .gitignore
└── dist/              # Compiled output (gitignored)
```

## Deployment

Deployed via **Vercel**. The `vercel.json` routes all HTTP methods to the compiled `dist/server.js` using the `@vercel/node` runtime.

```bash
npm run build   # Compile TypeScript
vercel --prod   # Deploy
```

In production (`NODE_ENV === 'production'`), the server does **not** call `app.listen()` — Vercel provides the HTTP server.

### Notes

- MongoDB connects on every invocation and closes in a `finally` block (suitable for serverless cold starts; not a long-lived connection).
- `cors` is installed but unused — middleware is registered but does not apply any origin restrictions.
- `import type` statements are used alongside `require()` — valid under `nodenext` + CommonJS (type-only imports are erased at runtime).
