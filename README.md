# Math BAC Landing

EasyMath is an educational prototype for individual online mathematics lessons
and BAC preparation in Moldova, not a production-readiness claim. Public-use
permissions, content approval and release checks require separate verification.

## Current implementation

Updated against local source for TASK-AUDIT-004; deployment, PR status and runtime
acceptance were not verified in this documentation update.

- Landing sections: Hero → Team (including a reviews carousel) → Advantages →
  Programs → FAQ → Contact, with a shared Header and Footer. Current Header
  navigation targets have matching section IDs.
- Footer includes social links, contact navigation and legal dialogs. The legal
  dialogs currently contain only a heading and close button, not legal policy text.
- Contact form: shared client/server validation, international phone parsing with
  `libphonenumber-js`, MD default, Server Action, server-side Turnstile verification
  and Resend notification. Provider acceptance is not proof of inbox delivery.
- Typed Romanian/Russian dictionaries and `/ro` / `/ru` routing exist. `/` uses a
  valid remembered preference, otherwise Romanian. Header, document language and
  metadata, page sections (including reviews and Footer), form copy and Turnstile
  messages use the route locale. Text-bearing illustrations have RO/RU variants;
  Turnstile also receives the locale. Translation quality and runtime presentation
  still require review.
- Language switching uses client-side navigation, preserving query/hash and scroll.
  TASK-012E.2 replaces the visit-long contact-use lock with explicit form-state
  coordination: empty/focused-empty and successful forms allow switching; drafts
  (including country-only changes) require discard confirmation. Pending or uncertain
  delivery blocks switching. Uncertainty also blocks repeat sends in the mounted form.

## Planned and deferred

The language-switch contract is implemented (TASK-012E.2), with
browser/mobile/cache acceptance still requiring manual review. **Contact submission
takes priority.** Reload/remount can reset the in-memory uncertainty protection;
it is not an exactly-once delivery guarantee.
The detailed localization research plan is kept locally and is not part of the
repository. The implemented switching behavior is documented in
[contact delivery and locale/form coordination](docs/contact-delivery.md).
Production contact delivery still requires Resend and Turnstile configuration,
a verified sending domain and an approved sender: the implementation currently
uses Resend's restricted test sender, `onboarding@resend.dev`. Deployment settings,
live delivery and inbox receipt were not verified in this update.
Rate limiting is deferred until evidence of abuse;
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
linked documents and do not establish current-branch acceptance. TASK-AUDIT-004
also checked source and documentation only; it did not verify deployment or run
application tests, a build, browser QA or live email.
