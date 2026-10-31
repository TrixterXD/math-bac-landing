# Implementation Plan — Math BAC Landing Page

> Version: **0.6**, with TASK-012D alignment · Original plan date: **2026-10-31** · Status: **historical backlog; current branch checkpoint below supersedes old handoff/status labels**
> Scope: **independent educational MVP**; Nastya has not approved commercial requirements. No code is authorized merely by this plan.

## Current checkpoint and active task — TASK-012D

Source-inspected on `feature/localization-routing`; no runtime checks or remote PR-status verification in this audit. The numbered backlog below preserves original sequencing, not a claim that all its gates are complete.

- Hero, Team/dialog, Advantages, FAQ and Contact exist. Contact includes shared validation, Server Action, Resend, truthful acceptance/uncertainty feedback and Turnstile; see contact docs for current contracts. Footer/Reviews remain absent; Programs is deferred.
- TASK-012B dictionaries and TASK-012C `/ro`/`/ru` routing/client navigation exist. Romanian is default; Russian alternative. Complete section/form/widget and image translation remains pending. See `docs/TASK-012-LOCALIZATION-PLAN.md`.
- TASK-012D scope: documentation audit only. No application/test/config changes or release actions.
- **Next switch task (agreed, not implemented):** allow empty/focused-empty and confirmed-success switching; explicit discard confirmation for non-empty drafts, including after confirmed failure; block pending; keep uncertainty warnings from silently disappearing and avoid accidental duplicates. Contact submission takes priority. Replace the temporary visit-long contact-use lock, not validation/security behavior.
- Rate limiting is deferred until evidence of abuse. Its proposal does not authorize implementation or make release safeguards complete.
- After PR #10 merges: verify merged routing/cookie/action behavior and actual acceptance results, refresh branch/PR wording, then approve the next small task. No assumption here that PR #10 has merged.

## 1. Goal and execution contract

Build a responsive one-page website for an online mathematics BAC preparation school. Audience: parents. Two journeys: TikTok → direct form and recommendation → information → form. Use **clearly fictional mock content** until the business supplies approved information.

**One task at a time:** clarify purpose and any essential unknowns → AI changes only approved files → developer reads diff and explains decisions → local checks and manual test → commit → merge/push as approved → next task.

**Source-of-truth order:** `PRODUCT_SPEC.md` for behavior; `DECISIONS.md` for selected choices; `CODE_STYLE_GUIDE.md` for conventions; `AGENTS.md` for AI scope; this plan for order and gates. If documents disagree, stop and reconcile deliberately.

## 2. Fixed baseline

- Next.js App Router, React, TypeScript strict, CSS Modules, Git/GitHub, Vercel target. Biome is selected and configured.
- Sections: Hero → Nastya/Team → Advantages → FAQ → Contact (Programs deferred) (with Header/Footer).
- Major sections as components; `src/app/[locale]/page.tsx` composes them directly. Data arrays live in typed `.data.ts` modules; section imports collection; item cards receive typed object props.
- Static sections default to Server Components; the form is a focused Client Component. Local `useState` draft; **no Jotai**.
- Phone: custom UI + `libphonenumber-js`, international countries, default `MD`, normalized E.164 on accepted input.
- Contact: required name and phone, optional comment. Client checks for UX; independent server validation. Server Action is thin coordinator; Resend is implemented. Structured field errors. First validation errors appear after submission; update as user corrects. Confirmed success clears fields; failure or uncertain outcome preserves values.
- No verified program content, testimonials, teacher credentials, scores, prices or brand assets yet. The prepared Nastya portrait is for prototype use, not proof of permission to publish. Do not present mocks as real business claims.

## 3. Working Git workflow

- Branch `main` holds stable integrated results. Use short-lived `feature/<task-slug>` branches as appropriate.
- Inspect diff; run relevant checks; manually verify; commit with Conventional Commits; merge; push only after approval.
- PRs are optional, useful for larger review. Never confuse a passing local build with a successful public deploy.
- For docs, `docs: ...`; for features, `feat: ...`; for fixes, `fix: ...`; no automatic commits by AI.

## 4. Historical task backlog (not the current handoff)

The checkpoint in section 1 controls current progress. The entries below preserve earlier planning snapshots, including obsolete status labels; they must not be used as the next-task instruction without checking source and current PR state. Each task includes an acceptance gate. **Original task IDs remain stable**; the executor combined initial setup under TASK-001. Design Foundation and responsive Header have been implemented and reviewed. Hero PR #3 has been merged into `main` by the developer. Team and Advantages implementations were subsequently reported accepted; verify merge/build status in GitHub before treating them as final. FAQ is implemented and pushed in PR #6, with final build/manual acceptance and merge pending. Do not mistake a visual review for completed technical acceptance.

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
- **Status:** Developer reports PR #3 merged and changes pulled into `main`. Hero desktop and mobile Variant C were visually approved. Historical audit findings and the scope of final build/QA are not independently reverified in this documentation update.
- References: `design/reference/landing-desktop.png`, `design/reference/hero/desktop.png`, `design/reference/landing-mobile.png`, `design/reference/hero/mobile-concept.png`.
- Runtime portrait: `public/images/hero/nastya-hero.png` (public/commercial-use approval pending).
- **TASK-005A:** Desktop semantic Hero with portrait, supporting copy, benefits and CTA — implemented.
- **TASK-005B:** Initial mobile adaptation — implemented.
- **TASK-005C:** Desktop responsive audit — report at `design/qa/TASK-005C-desktop-responsive-audit.md`; reported clipping/height concerns remain to be dispositioned, not silently marked fixed.
- **TASK-005D:** Mobile Variant C — implemented: heading/description → portrait → compact benefits → CTA → disclaimer; introductory pill hidden on mobile. Mobile visual approved.
- **TASK-005E:** Three decorative PNGs added and integrated on desktop; desktop visual approved. Agent initially hid them on small screens without verifying a real problem.
- **TASK-005F:** Mobile decorative composition implemented and committed as `506bccc`: math note near heading, pyramid and lesson note beside portrait. Developer visually inspected responsive sizes and approved; agent reported lint, typecheck and diff checks passed. No automated browser QA or production build claimed for this task.
- **Video CTA:** Deferred pending a real approved video and destination.
- **Remaining integration notes:** PR #3 is merged according to the developer; any unresolved audit, production build, and anchor checks should be verified separately and not presumed passed. `#contact` target depends on the future Contact section.

**TASK-006 — Team section (`feature/team-section`, historical)**
- **Status:** Team desktop/mobile and Nastya dialog were subsequently reported implemented and visually accepted; older per-step notes below are historical. Verify integrated branch status and final QA rather than treating the old TASK-006.2 pending label as current. Developer-provided report: `npm run lint`, `npm run typecheck`, `git diff --check` passed; production build and browser interaction QA were **not run**. Source diff and precise final code still require developer inspection.
- Depends on: TASK-003; integrated Hero from `main`.
- Reference: `design/reference/landing-desktop.png`; desktop screenshot review on 2026-10-30. Runtime artwork: `public/images/team/` and related decorations, exact filenames verified against repository at implementation time.
- **TASK-006.1 — Static desktop:** `src/components/TeamSection/TeamSection.tsx` (Server Component), reusable `TeacherCard.tsx`, typed `team.data.ts`, `TeamSection.module.css`, and `src/app/page.tsx` integration after Hero. Four portraits: Nastya dominant, three fictional demo teachers. `id="about"` matches Header. No team CTA. Decorative alt empty; no click handlers in this increment. Final desktop screenshot accepted visually. Handwritten «Больше, чем просто уроки» omitted by explicit design decision.
- **TASK-006.2 — Mobile composition (next):** design and implement a compact two-column, two-row (2×2) portrait arrangement with Nastya visually larger/emphasized. Preserve readable heading and copy, no horizontal scroll, usable widths around 360–390px and tablet; exact breakpoints/relative sizes to be determined by actual screenshots. This task does not add the dialog.
- **TASK-006.3 — Nastya interaction:** Only Nastya's `TeacherCard` is interactive. `NastyaProfile` is a focused Client Component that owns card/dialog interaction; `TeamSection` stays server-rendered. Persistent lilac «О Насте ↗» label visible on mobile and desktop; restrained lift/shadow/pointer on desktop hover; honor reduced motion. Open a modal with explicitly labeled placeholder description (Lorem Ipsum) and accessible keyboard/focus/Escape/close behavior. Consider native `<dialog>` with `showModal()` and a ref; a separate React boolean state or `TeacherProfileDialog` file is not required until justified. Other three cards remain entirely static. Do not add a separate «Познакомиться с командой» CTA.
- **TASK-006.4 — QA/acceptance:** inspect desktop/mobile and tablet screenshots, actual code diff, semantics, button/card focus, dialog dismissal and focus restoration, motion preference, TypeScript/lint/build, no unintended Hero/Header changes, and missing/placeholder business facts. Commit/push only after developer approval.
- **Product guardrail:** Nastya image is user-provided/edited for prototype; public permission remains pending. Three remaining portrait subjects are fictional and must never imply verified employees. Text and composition are demonstrative.

**TASK-007 — Advantages section**
- **Status:** Implemented and visually accepted according to the developer; merge/build status should be checked against repository.
- Depends on: TASK-003.
- Scope: 3 mock advantages from spec, typed data where helpful.
- Accept: readable on phone/desktop and not presented as verified school claims.

**TASK-008 — Programs section**
- **Status:** DEFERRED pending discussion with Nastya about real program formats. Do not implement mock cards now.
- Depends on: TASK-003.
- Scope: typed demo program collection + `ProgramsSection` imports it + `ProgramCard` receives one object via props.
- Accept: two fake programs render; changing data does not require rewriting JSX; no state library.

**TASK-009 — FAQ section**
- **Status:** TASK-009.1–009.3 implemented and pushed to PR #6 (`feature/faq-section`); review found and fixed mobile DOM-order issue. Latest known branch is 2 commits ahead of `main`, 0 behind. Final local manual checks, `npm run build`, and merge are not yet confirmed.
- **Implementation:** `FAQSection` Server Component, typed demo Q&A, native `<details name="faq">` across both columns; consecutive array halves form independent desktop stacks and sequential mobile reading/tab order. Decorative `public/images/faq/questions-note.png`.
- Depends on: TASK-003.
- Scope: mock question/answer content; prefer semantic native `<details>` if adequate.
- Accept: accessible keyboard behavior and coherent layout without unnecessary client JS.

**TASK-010 — Contact section (UI first; Footer separate pending item)**
- Depends on: TASK-003; anchors from TASK-004/005.
- Scope: build Contact against provisional mockup as a scoped UI increment; Footer remains a separate shell task and should not be silently bundled into Contact form work.
- Accept: accessible fields/name/phone/country area/optional comment and correct responsive composition, with no fake submit behavior or success message.
- **TASK-010.1:** Reference-faithful UI only; branch `feature/contact-section` after updating `main`; visually review before approval.
- **TASK-010.2:** Focused client form state, agreed field schema, phone library and client validation; preserve existing separation of presentation and logic.
- **TASK-010.3:** Server Action, independent validation, typed result, real email provider configuration and delivery error handling.
- **TASK-010.4:** Vercel Preview integration and end-to-end test on phone, with real test email. This is a compressed demo sequence, not a waiver of the detailed safety/QA gates of TASK-012–021.

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
- Scope: review existing Turnstile, safe logging, privacy notice and data minimization suitable for the eventual jurisdiction; confirm legal text before commercial launch. Rate limiting is deferred until evidence of abuse (D-029), not a mandatory implementation gate.
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
- Current phone rules/limits and Resend are implemented. Verified public sender/domain, delivery retry/idempotency and privacy/legal approval remain unresolved. Rate limiting is deferred until evidence of abuse.
- Node test-runner tests exist; broader automation/CI matrix remains open.
- Future mobile API, CMS, payments, analytics, admin panel, Jotai and backend database are **out of MVP scope**.

## 7. Historical handoff (2026-10-31; superseded by TASK-012D checkpoint)

Repository: `https://github.com/TrixterXD/math-bac-landing` (private). As of last review, FAQ PR #6 is open with TASK-009.3 pushed. Verify `main` has the accepted FAQ before starting Contact branch; do not assume merge from an open PR.

**Next:** Confirm FAQ manual checks/build and merge; then TASK-010.1 Contact UI based on provisional user-supplied mockup, on `feature/contact-section`. After UI visual approval, proceed in small increments toward a **Monday, 2026-11-02 controlled Vercel Preview demonstration** with real test notification delivery. This milestone is aspirational and does not replace security/privacy or commercial release gates. PRODUCT_SPEC.md was unavailable for that historical update; TASK-012D has since reviewed it and aligned the current journey/composition checkpoint.


## 8. Milestone interpretation (2026-10-31)

The existing TASK-012–021 sequence remains the detailed engineering/release checklist. The TASK-010.2–010.4 labels above are **implementation increments for the weekend demo**, not replacements for those checks. A preview that submits real personal contact data should be limited to authorized test participants; verify provider acceptance vs actual inbox arrival, secret handling, accessible failure states and a proportionate abuse/privacy approach before enabling broader access. Do not treat successful preview testing as permission to publicly launch the school website.
