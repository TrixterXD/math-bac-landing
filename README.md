# Math BAC Landing

Educational prototype for online mathematics BAC preparation in Moldova, not a
production-ready school website. Business copy and teacher content still include
explicit demo placeholders; public-use permissions and release checks remain open.

## Current implementation

Source-inspected on `feature/localization-routing` for TASK-012D; this is not a
claim that PR #10 is merged or that runtime acceptance passed.

- Landing sections: Hero → Team → Advantages → FAQ → Contact. Programs is deferred;
  Footer and Reviews are not implemented. Some navigation targets remain unresolved.
- Contact form: shared client/server validation, international phone parsing with
  `libphonenumber-js`, MD default, Server Action, server-side Turnstile verification
  and Resend notification. Provider acceptance is not proof of inbox delivery.
- Typed Romanian/Russian dictionaries and `/ro` / `/ru` routing exist. `/` uses a
  valid remembered preference, otherwise Romanian. Header, document language and
  metadata use the route locale; page sections, form/widget copy and image assets
  are **not yet fully localized**.
- Language switching uses client-side navigation, preserving query/hash and scroll.
  The temporary contact-use lock blocks switching for the rest of the visit after
  form focus/use (even if empty), or when autofill is detected. This is deliberately
  more restrictive than the agreed next-task contract.

## Planned and deferred

The next language-switch task must allow empty/focused-empty forms and confirmed
success, confirm discarding non-empty drafts (including after confirmed failure),
block pending submissions, and preserve uncertainty warnings without encouraging
duplicates. **This contract is not implemented yet. Contact submission takes priority.**
The detailed localization research plan is kept locally and is not part of the
repository. The agreed switching behavior is documented in
[Product Specification](PRODUCT_SPEC.md) and [Decision Log](DECISIONS.md).
Remaining work includes section/form/widget translations and localized image
assets. Rate limiting is deferred until evidence of abuse;
Turnstile is implemented but is not a rate limiter. No planned feature is a release claim.

## Local setup

Foundation setup was verified with Node.js 24.22.1 and npm 11.19.1; use Node.js 24 LTS.

```sh
npm ci
npm run dev
```

Open http://localhost:3000 (redirects to `/ro` or remembered `/ru`). Stop with Ctrl+C.
Contact delivery requires the private configuration documented below; never commit
secrets or send a test email without explicit authorization.

## Commands and architecture

- `npm run dev` — development server.
- `npm run typecheck` — generate Next.js route types, then strict TypeScript checks.
- `npm run lint` — Biome formatting, lint and import-order checks; warnings fail.
- `npm run format` — apply Biome formatting.
- `npm run build` / `npm start` — build / serve the production build locally.

Next.js App Router, Server Components by default, focused client interaction,
CSS Modules, Manrope, local form state and `@/*` → `src/*`. No localization package
or global state library. The locale root layout lives in `src/app/[locale]`;
`src/proxy.ts` handles entry redirects and preference persistence.

Tests use Node's test runner after TypeScript compilation; there is no `npm test`
script. See [delivery tests/setup](docs/contact-delivery.md) and
[Turnstile setup/testing](docs/contact-security.md). Dictionary and Proxy test
sources live in `src/i18n/messages.test.ts` and `src/proxy.test.ts`.

## Project documentation and verification

- [Product and user journeys](PRODUCT_SPEC.md) — working hypotheses, not user research.
- [Decisions](DECISIONS.md), [implementation plan](IMPLEMENTATION_PLAN.md),
  [code style](CODE_STYLE_GUIDE.md), [AI rules](AGENTS.md).

TASK-012D checked documentation against source only; no application tests, build,
browser QA or live email was run. Historical verification reports remain in the
linked documents and do not establish current-branch acceptance. After PR #10
merges, revisit branch/status wording, routing acceptance and the next switch task.
