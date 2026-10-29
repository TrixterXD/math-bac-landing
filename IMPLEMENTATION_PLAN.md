# Implementation Plan — Math BAC Landing Page

> Version: **0.3** · Date: **2026-10-29** · Status: **Foundation and Header integrated; Hero preparation underway**
> Scope: **independent educational MVP**; Nastya has not approved commercial requirements. No code is authorized merely by this plan.

## 1. Goal and execution contract

Build a responsive one-page website for an online mathematics BAC preparation school. Audience: parents. Two journeys: TikTok → direct form and recommendation → information → form. Use **clearly fictional mock content** until the business supplies approved information.

**One task at a time:** clarify purpose and any essential unknowns → AI changes only approved files → developer reads diff and explains decisions → local checks and manual test → commit → merge/push as approved → next task.

**Source-of-truth order:** `PRODUCT_SPEC.md` for behavior; `DECISIONS.md` for selected choices; `CODE_STYLE_GUIDE.md` for conventions; `AGENTS.md` for AI scope; this plan for order and gates. If documents disagree, stop and reconcile deliberately.

## 2. Fixed baseline

- Next.js App Router, React, TypeScript strict, CSS Modules, Git/GitHub, Vercel target. Biome is selected and configured.
- Sections: Hero → Nastya/Team → Advantages → Programs → FAQ → Contact (with Header/Footer).
- Major sections as components; `app/page.tsx` can compose them directly. Data arrays live in typed `.data.ts` modules; section imports collection; item cards receive typed object props.
- Static sections default to Server Components; the form is a focused Client Component. Local `useState` draft; **no Jotai**.
- Phone: custom UI + `libphonenumber-js`, international countries, default `MD`, normalized E.164 on accepted input.
- Contact: required name and phone, optional comment. Client checks for UX; independent server validation. Server Action is thin coordinator; email provider not yet chosen. Structured field errors. First validation errors appear after submission; update as user corrects. Confirmed success clears fields; failure or uncertain outcome preserves values.
- No verified program content, testimonials, teacher credentials, scores, prices or brand assets yet. The prepared Nastya portrait is for prototype use, not proof of permission to publish. Do not present mocks as real business claims.

## 3. Working Git workflow

- Branch `main` holds stable integrated results. Use short-lived `feature/<task-slug>` branches as appropriate.
- Inspect diff; run relevant checks; manually verify; commit with Conventional Commits; merge; push only after approval.
- PRs are optional, useful for larger review. Never confuse a passing local build with a successful public deploy.
- For docs, `docs: ...`; for features, `feat: ...`; for fixes, `fix: ...`; no automatic commits by AI.

## 4. Task backlog

Each task includes an acceptance gate. **Original task IDs remain stable**; the executor combined initial setup under TASK-001. Design Foundation and responsive Header have been implemented and reviewed. TASK-005 is next; further feature work still requires explicit developer authorization.

### Phase A — Foundation

**TASK-001 — Repository and environment agreement**
- **Status:** Implemented as part of combined foundation setup; reviewed provisionally.
- Depends on: current documents.
- Scope: choose project/repository name, supported Node version and exact starter setup; inspect developer machine and existing repository status before initializing anything.
- Accept: a short written setup checklist, documented chosen defaults, no surprise dependencies or code changes.
- Review focus: what each tool solves; why the choices are needed.

**TASK-002 — Initialize Next.js project and quality tools**
- **Status:** Implemented in initial foundation commit `e5d96f5`; human review/final acceptance pending.
- Depends on: TASK-001.
- Scope: initialize Next.js App Router with TS and `src/`; configure strict mode, CSS Modules and a chosen formatter/linter (Biome candidate); minimal Git ignore.
- Accept: starter launches locally; typecheck/lint/build commands documented and actually run; generated files reviewed.
- Commit candidate: `chore: initialize next app`.

**TASK-003 — Global shell and minimal styles**
- **Status:** Initial shell and Design Foundation implemented; Manrope and global CSS tokens in use. Header is integrated in RootLayout; Footer remains pending.
- Depends on: TASK-002.
- Scope: `layout.tsx`, `page.tsx`, base CSS, fonts and basic layout primitives only as needed; no comprehensive design system invented.
- Accept: semantic page shell renders, no hydration warnings, mobile width check.
- Commit: `feat: add page shell`.

### Phase B — Static landing sections

**Navigation dependency:** Header includes a `#reviews` anchor because the approved visual reference does. The current section backlog has no standalone Reviews task. Decide whether to add a real Reviews section (with clearly labeled demo content) or adjust navigation before final navigation acceptance; do not invent testimonials to fill the gap.

**TASK-004 — Header/navigation**
- **Status:** Desktop TASK-004A and mobile TASK-004B implemented and reviewed. Final anchor destinations depend on subsequent sections.
- Depends on: TASK-003.
- Scope: minimal brand placeholder and navigation anchors to existing/future sections; accessible navigation semantics. Render shared Header through root `layout.tsx` (A-018).
- Accept: keyboard navigation works, links target correct anchors after target sections are added; no fabricated social URLs.

**TASK-005 — Hero section**
- **Status:** Reference and prepared portrait paths selected; implementation not started.
- Depends on: TASK-003; coordinate anchor with TASK-004.
- References: `design/reference/landing-desktop.png` (overall) and `design/reference/hero/desktop.png` (desktop crop).
- Runtime portrait: `public/images/hero/nastya-hero.png` (prepared image based on the supplied Nastya photograph; public/commercial-use approval pending).
- **TASK-005A (desktop):** implement the Hero as semantic HTML/CSS Modules and a responsive-positionable `next/image` portrait; headline, supporting text, illustrative benefit items and contact CTA. Compare at an agreed desktop width (starting at 1440px). Recreate simple decorations where practical; identify missing standalone imagery. No other landing sections.
- **TASK-005B (mobile):** after review of 005A, design/adapt Hero for narrow viewports; preserve prominent copy, portrait and CTA without overflow.
- **Video CTA:** no verified video or URL exists. Do not add a deceptive functional control. Defer or mark clearly as a nonfunctional mock only if specifically approved.
- **Accept:** desktop visual differences documented, sensible semantics, contrast and keyboard behavior, no unsupported school claims, build/lint/typecheck run, mobile checked after 005B; CTA resolves to the actual form once the Contact section exists. Do not merge as a completed responsive section until both phases are accepted.

**TASK-006 — Team section**
- Depends on: TASK-003.
- Scope: own component + typed demo team data; no fabricated real bios or unauthorized photos. A real portrait of Nastya may be reused only with permission; other teacher portraits remain pending.
- Accept: consistent cards and responsive rendering; copy marked as demonstrative.

**TASK-007 — Advantages section**
- Depends on: TASK-003.
- Scope: 3 mock advantages from spec, typed data where helpful.
- Accept: readable on phone/desktop and not presented as verified school claims.

**TASK-008 — Programs section**
- Depends on: TASK-003.
- Scope: typed demo program collection + `ProgramsSection` imports it + `ProgramCard` receives one object via props.
- Accept: two fake programs render; changing data does not require rewriting JSX; no state library.

**TASK-009 — FAQ section**
- Depends on: TASK-003.
- Scope: mock question/answer content; prefer semantic native `<details>` if adequate.
- Accept: accessible keyboard behavior and coherent layout without unnecessary client JS.

**TASK-010 — Contact section shell and Footer**
- Depends on: TASK-003; anchors from TASK-004/005.
- Scope: section header, nonfunctional form container/placeholder, and shared Footer in root `layout.tsx` (A-018), with only confirmed or labeled placeholder links.
- Accept: full page sections compose in selected order; anchors work; no dead 'submit' button implying actual delivery.

**TASK-011 — Static page quality pass**
- Depends on: TASK-004–010.
- Scope: inspect smartphone/tablet/desktop layouts; semantic headings, focus, anchors, images and mock-content labels.
- Accept: manual checklist completed, lint/typecheck/build pass; issues logged and fixed within agreed scope.

### Phase C — Form and validation

**TASK-012 — Define contact input and result contracts**
- Depends on: TASK-011.
- Scope: agree types, limits, error categories, privacy wording and success/failure semantics before implementing validation. Decide handling of unknown delivery outcomes.
- Accept: documented examples for valid/invalid name, country, phone, comment; meaningful structured result variants; no guesses disguised as client decisions.

**TASK-013 — ContactForm UI and draft state**
- Depends on: TASK-012.
- Scope: interactive fields, unified `useState` object for name/country/phone/comment, accessible labels, no live server delivery.
- Accept: draft updates correctly, optional comment supported, country defaults to MD, screen and keyboard interaction checked.

**TASK-014 — Phone parsing and normalization**
- Depends on: TASK-013.
- Scope: approve/add `libphonenumber-js`, own reusable helper, decide `min`/`max` metadata and paste behavior based on tests.
- Accept: national and international input examples, invalid numbers, E.164 normalization tested; no naive country-code concatenation.

**TASK-015 — Client validation and UX**
- Depends on: TASK-014.
- Scope: validate whole draft, show field errors after first attempt and update visible errors while fixing, focus/announcement accessible.
- Accept: simultaneous field errors, optional comment, valid draft path; no premature errors.

### Phase D — Server and delivery

**TASK-016 — Server Action with validation (mock delivery)**
- Depends on: TASK-015.
- Scope: thin Server Action plus independent server validation; structured result; fake delivery in development only.
- Accept: invalid input rejected even if client bypassed; no real email sent; typed responses handled without unsafe casts.

**TASK-017 — Delivery provider adapter**
- Depends on: TASK-016.
- Scope: choose provider, verify domain/sender requirements, server-only credentials, focus on one send-notification function.
- Accept: documented delivery configuration; controlled success/failure demonstration without secrets in Git.

**TASK-018 — End-to-end result states**
- Depends on: TASK-017.
- Scope: pending/submitting, structured field errors, safe delivery-error message, confirmed-success reset, unknown network-result branch. Decide safe retry/de-duplication strategy before exposing repeated submit.
- Accept: known-success, invalid-fields, delivery failure, disconnect uncertainty checked; preserves values unless confirmed success; avoids duplicate state ownership.

**TASK-019 — Abuse/privacy guardrails**
- Depends on: TASK-018.
- Scope: decide and implement proportionate anti-spam/rate limiting, safe logging, privacy notice and data minimization suitable for the eventual jurisdiction; confirm legal text before commercial launch.
- Accept: secrets protected, spam-path tests, no unnecessary personal data in logs, unresolved legal items explicitly marked as launch blockers.

### Phase E — Release

**TASK-020 — Comprehensive QA and accessibility**
- Depends on: TASK-019.
- Scope: mobile/desktop, keyboard/screen-reader basics, form edge cases, actual build and smoke tests.
- Accept: checklist and issues with disposition, no false claims of passing unrun tests.

**TASK-021 — Vercel preview deployment**
- Depends on: TASK-020; approval required.
- Scope: environment variables, preview deploy, production-like server/email checks with safe test recipient.
- Accept: public preview tested on mobile and desktop; email provider acceptance distinguished from inbox delivery; no secret exposure.

**TASK-022 — Production launch handoff**
- Depends on: TASK-021 and business approval.
- Scope: replace mock content/assets with verified school data, approve legal/privacy text, finalize recipient/domain, run production smoke test, deploy when authorized.
- Accept: no unapproved claims, clear operator handoff, verified contact flow; only then declare commercial release.

## 5. Per-task acceptance checklist

- [ ] Objective and allowed changes agreed before AI coding
- [ ] No unrelated refactoring, unapproved packages, speculative abstractions or imaginary business claims
- [ ] Code understandable to developer; non-obvious decisions explained
- [ ] Strict TS, lint/format/build and relevant tests actually checked (or marked not run)
- [ ] UI checked where relevant: mobile, keyboard, error and empty states
- [ ] Developer inspects changed files and diff
- [ ] Commit after acceptance; merge/push only when approved
- [ ] Update decision/spec/style documentation only for genuinely changed rules

## 6. Explicitly deferred (not implicit approval)

- Exact versions and configuration, final brand/palette, actual portrait or teacher bios, business programs/prices, real social links.
- Phone validation strictness, exact per-field limits, provider, domain/sender, delivery retry, deduplication, rate limit and privacy/legal requirements.
- Test runner and exact automation/CI matrix, if benefits outweigh setup overhead.
- Future mobile API, CMS, payments, analytics, admin panel, Jotai and backend database are **out of MVP scope**.

## 7. Current handoff

Repository: `https://github.com/TrixterXD/math-bac-landing` (private), stable branch `main`. Design Foundation and Header were developed and reviewed in prior PRs. The next scoped change is TASK-005A, **desktop Hero only**.

Before invoking an agent, confirm the files `design/reference/hero/desktop.png` and `public/images/hero/nastya-hero.png` are in the target branch; use the reference only for design guidance and the portrait as the runtime image. Review implementation before any commit/merge. Unverified claims and public-use permission remain open.
