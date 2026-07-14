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

No tests, linter, formatter, or typecheck scripts configured.

## Project structure

```
server.ts            # entrypoint (Express scaffold with dotenv + cors + one route)
package.json         # scripts, deps
tsconfig.json        # minimal: "types": ["node"], module:nodenext
vercel.json          # @vercel/node runtime, routes → server
.env                 # ignored (PORT defaults to 5000)
.env.example         # empty (placeholder only)
```

## Deploy (Vercel)

`vercel.json` uses the `@vercel/node` Serverless Functions runtime — imports `server.ts` directly at deploy time. The `build`+`start` scripts in `package.json` are for non-Vercel production only.

## Known quirks

- `server.ts` has the basic Express scaffold; MongoDB connection not yet written.
- `tsconfig.json` must use `module:nodenext` + `moduleResolution:nodenext` — TS7 removed `commonjs`/`node` options.
- Use `import type { ... } from 'express'` for type imports alongside `require()` calls — `import type` is runtime-erased, valid under nodenext + commonjs.
- `typescript` lives in `dependencies` (not `devDependencies`) — intentional for Vercel deployment.
- `ts-node-dev` is a stale devDependency (unused after switching to `tsx`).
- Only source file is `server.ts` at the root; no `src/` directory or route modules exist.
