# Math BAC Landing — Foundation

Educational prototype for online mathematics BAC preparation in Moldova.
TASK-001 initializes tooling only; the landing page is not implemented.
Developer review is required before further implementation.

## Local setup

Verified with Node.js 24.22.1 (use Node.js 24 LTS) and npm 11.19.1.

```sh
cd math-bac-landing
npm ci
npm run dev
```

Open http://localhost:3000. Stop the server with Ctrl+C.

## Commands

- `npm run dev` — development server.
- `npm run typecheck` — generate Next.js route types, then run strict TypeScript checking without emitting files.
- `npm run lint` — Biome formatting, lint, and import-order checks; warnings fail the check.
- `npm run format` — apply Biome formatting.
- `npm run build` — production build.
- `npm start` — serve the production build locally.

## Foundation choices

- Next.js App Router with `src/app`; Server Components by default.
- Strict TypeScript; `@/*` resolves to `src/*`.
- Native CSS Modules (`*.module.css`); global CSS only for a small baseline.
- System fonts; no external font requests or starter demo assets.
- Biome recommended rules, including React/Next.js rules, two-space indentation,
  and import organization. Generated output and dependencies are excluded.
- Standard `next.config.ts`; no deployment-specific configuration.
- npm lockfile records dependency versions. No additional runtime libraries.
- No Git repository was initialized; no GitHub, CI, or deployment integration.

## TASK-001 verification

Dependency installation, Biome checks, strict type checking, and production build
passed. Both development and production servers returned HTTP 200 with the
prototype heading, placeholder content, and a stylesheet link; an unknown route
returned HTTP 404. Smoke-check servers were stopped afterward.

For manual review, start the app, check the placeholder at desktop and mobile
widths, and confirm there are no browser console errors. Browser-based visual and
accessibility checks have not been performed. There is no dedicated test runner
at this stage.

The planning documents remain unchanged in the parent directory. The explicit
TASK-001 request authorized initialization and Biome, superseding the older
backlog's foundation task numbering. No subsequent task has been implemented.
