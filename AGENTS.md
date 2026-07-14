# TravelSpot Backend

## Stack

- **Express 5** + **TypeScript 7** (via `tsx`) + **MongoDB driver 7**
- `commonjs` module system

## Dev commands

```bash
npm run dev          # tsx watch server.ts   (dev with auto-restart)
npm run build        # tsc                   (compile to dist/)
npm run start        # node dist/server.js   (production)
```

No test, lint, format, or typecheck scripts configured.

## Project structure

```
server.ts            # entrypoint — Express + MongoDB (MongoClient, serverless-style)
package.json         # commonjs, deps
tsconfig.json        # module:nodenext, rootDir:.
vercel.json          # @vercel/node runtime, sources dist/server.js
.env                 # ignored (MONGODB_URI, MONGODB_DB)
.env.example         # env template (placeholder credentials)
.env.local           # created by `vercel env pull` (ignored by .gitignore)
.gitignore           # ignores node_modules, .env, .env*, dist, .vercel
```

## Deploy (Vercel)

`vercel.json` routes all HTTP methods to `dist/server.js` via the `@vercel/node` runtime. `tsc` must produce `dist/server.js` before deploy. The `build`+`start` scripts are for non-Vercel production only.

## Known quirks

- `server.ts` connects to MongoDB on every invocation and closes the client in a `finally` block — the connection is not long-lived. This works for serverless but reconnects per cold start.
- `cors` is installed (`package.json`) but never called via `app.use()` — unused dependency.
- `import type { Request, Response } from 'express'` alongside `require()` is valid under nodenext + commonjs (`import type` is runtime-erased).
- `typescript` lives in `dependencies` (not `devDependencies`) — intentional for Vercel deployment.
- `ts-node-dev` is a stale devDependency (unused since switching to `tsx`).
- `module.exports = app` at the bottom enables the Vercel serverless handler handler (`@vercel/node` expects a module export).
- In production (`NODE_ENV === 'production'`), `app.listen()` is skipped — Vercel provides the HTTP server.
- `.env.local` contains a `VERCEL_OIDC_TOKEN` and is created by `vercel env pull`; do not commit.
