# Decision Log — Math BAC Landing Page

> Version: **0.5** · Updated: **2026-10-29**  
> These decisions apply to a **hypothetical educational MVP**, not a signed-off commercial project.

Each entry identifies the choice, reason, alternatives, and current status. **Agreed** means agreed for the prototype, not verified with Nastya.

## D-001 — Build a learning prototype before the client brief
- **Status:** Agreed.
- **Choice:** Design an independent landing-page MVP; adapt only after Nastya clarifies her needs.
- **Reason:** Learn the full engineering workflow without inventing binding customer requirements.
- **Constraint:** Keep assumptions explicitly provisional.

## D-002 — School positioning, rather than solo tutor portfolio
- **Status:** Working product hypothesis.
- **Choice:** Present a BAC mathematics preparation business led by Nastya and a team of teachers.
- **Reason:** Nastya teaches and supervises several other teachers.
- **Open:** Brand identity and exact school offering.

## D-003 — Parents are the primary website audience
- **Status:** Agreed for prototype.
- **Choice:** Write UX/content primarily for parents of BAC candidates.
- **Reason:** Parents may research and arrange/pay for preparation.
- **Alternative:** Students-first or mixed-audience positioning.
- **Open:** Validate with real conversion behavior.

## D-004 — Two entry journeys on one landing page
- **Status:** Agreed as scenarios.
- **Choice:** Support quick-contact TikTok arrivals and research-oriented referrals without creating two separate sites.
- **Reason:** Different visitor information needs; both can converge on one conversion.
- **Caveat:** Source does not force behavior; either visitor can take either path.

## D-005 — Contact form as primary conversion
- **Status:** Agreed for learning MVP.
- **Choice:** Submit a contact request rather than require booking/payment.
- **Reason:** Lower commitment; teaches form, server boundaries and delivery.
- **Alternatives:** Direct messenger, appointment booking, combined contact paths.
- **Open:** Alternative contact on error and real business preference.

## D-006 — Minimal form with optional context
- **Status:** Agreed at the field level.
- **Choice:** Required name and phone; optional comment with helpful prompts.
- **Reason:** Give the school advance context without forcing parents through a long questionnaire.
- **Caveat:** Suggested savings in consultation time are hypothetical, not measured.
- **Open:** Limits, exact field labels, privacy wording.

## D-007 — International telephone support for practice
- **Status:** Agreed for learning MVP.
- **Choice:** A country picker with Moldova (`MD`) default, plus international-number support.
- **Reason:** Learn a nontrivial input pattern and third-party library integration.
- **Tradeoff:** More complexity than Moldova-only contact collection.

## D-008 — Own phone UI + libphonenumber-js
- **Status:** Agreed for learning MVP.
- **Choice:** Implement the presentation in our React/CSS Modules UI; use `libphonenumber-js` for parsing, formatting, and validation; normalize to E.164.
- **Alternative:** A prebuilt `react-phone-number-input` component.
- **Reason:** Better practice with integration boundaries and custom UI ownership.
- **Open:** Phone metadata, valid vs possible semantics, paste/format behavior, input constraints.

## D-009 — Client checks improve UX; server validation is authoritative
- **Status:** Agreed.
- **Choice:** Validate on both client and server; do not trust browser-supplied values.
- **Reason:** Client-side restrictions can be bypassed.
- **Caveat:** Validation does not prove phone ownership or prevent spam by itself.

## D-010 — Separate validation success from delivery success
- **Status:** Agreed principle; transport not final.
- **Choice:** Only show confirmed success once server has received suitable acknowledgment from the delivery provider; never infer inbox delivery from acceptance.
- **Proposed mechanism:** Email service (provider not selected).
- **Reason:** A valid request may still fail to reach the school's notification pipeline.

## D-011 — Preserve values and explain submission errors
- **Status:** Agreed for value preservation; alternative-contact policy open.
- **Choice:** Keep form entries after failure and display actionable language rather than raw technical errors.
- **Reason:** Avoid making the parent repeat work; don't disclose internal implementation details.
- **Open:** Retry behavior when the network outcome is uncertain, de-duplication, alternative messenger link.

## D-012 — Incremental AI-assisted engineering
- **Status:** Agreed.
- **Choice:** Requirements → architecture/style guide → small AI-written increments → developer code review/explanation → test → Git commit.
- **Reason:** The learner remains accountable for engineering decisions and understanding.
- **Constraint:** Do not advance until the current step has been understood.

## D-013 — Centralized user-facing error messaging as an architecture hypothesis
- **Status:** Proposed; not yet designed or implemented.
- **Choice:** Explore mapping meaningful application error categories to readable messages, with a fallback for unknown errors.
- **Reason:** Consistency and understandable feedback, without leaking technical details.
- **Caveat:** Do not presume HTTP errors correspond directly to particular user advice. Categories and response contract will be studied at implementation time.

## D-014 — Online delivery is core to the offer
- **Status:** Known context from discussion; website copy/design agreed for prototype.
- **Choice:** State that preparation lessons are online, including prominently in the hero.
- **Reason:** Visitors need to understand delivery format; generic classroom scenes could be misleading.

## D-015 — Prototype section sequence
- **Status:** Agreed for prototype; not tested with visitors.
- **Choice:** Hero → Nastya and team → Advantages → Programs → FAQ → Form (plus header/footer).
- **Reason:** Lead with founder recognition/trust while letting new visitors research and TikTok visitors jump directly to the form.
- **Tradeoff:** Programs appear below trust-building sections; hero must explain the actual offer early.

## D-016 — Hero portrait and direct CTA
- **Status:** Agreed design direction; actual photo subject to Nastya's approval.
- **Choice:** Make Nastya's portrait the main hero visual; show online BAC preparation and immediate form CTA.
- **Reason:** TikTok audiences may recognize her; newcomers see the person leading the school.
- **Tradeoff:** On mobile, avoid a portrait that crowds out key messaging and the CTA.

## D-017 — Illustrative learning benefits are placeholders
- **Status:** Proposed demo copy only, **not verified or client-approved**.
- **Choice:** Prototype advantages around low-stress learning, understanding rather than rote algorithms, and a safe space to ask questions.
- **Reason:** Coherent positioning exercise in the absence of an approved brand brief.
- **Constraint:** Do not publish these as factual school claims without confirmation.

## D-018 — Defer implementation-specific technical quiz questions
- **Status:** Agreed learning-workflow refinement.
- **Choice:** During product discovery, settle what the system should do and why; study concrete provider errors, HTTP codes and library mechanics during their relevant implementation tasks.
- **Reason:** Keep architectural exploration distinct from testing knowledge not yet taught.

## D-019 — Demo content rather than speculative marketing discovery
- **Status:** Agreed for learning prototype.
- **Choice:** Use openly fictional program descriptions, benefits and FAQ content to build sections; final business copy belongs to Nastya.
- **Reason:** The project goal is engineering practice, not preparing an unapproved marketing strategy.
- **Constraint:** Never present mock claims as real school achievements.

## A-001 — Major sections are separate components
- **Status:** Agreed.
- **Choice:** Use individual React components for each major section, composed by the page; do not automatically add a `LandingPage` wrapper.
- **Reason:** Clear responsibilities and navigation in the codebase.
- **Tradeoff:** Avoid extracting trivial markup into unnecessary components.

## A-002 — Separate static mock content from JSX
- **Status:** Agreed.
- **Choice:** Store typed mock collections in dedicated data modules.
- **Reason:** Readable presentation components and easy later copy replacement.
- **Caveat:** Separate data does not inherently require state or props across every level.

## A-003 — Local state; no Jotai for MVP
- **Status:** Agreed.
- **Choice:** React local state for the interactive form, ordinary constants for static content.
- **Reason:** No current shared mutable state problem justifies a global state library.
- **Revisit if:** Several independent components genuinely need shared, changing state.

## A-004 — Direct section imports and typed card props
- **Status:** Agreed for static lists.
- **Choice:** A section imports its own array; it passes individual program objects into card components through props.
- **Reason:** Simple data flow with practice of typed props.
- **Caveat:** Not a universal prohibition on passing full collections via props.

## A-005 — Folders grouped by technical responsibility
- **Status:** Agreed as starting organizational strategy.
- **Choice:** Favor `src/app`, `src/components`, `src/data`, `src/types`, `src/lib` as needed, instead of a full feature-first directory tree.
- **Reason:** Easy orientation for a small landing page.
- **Caveat:** Do not create unused directories or require a folder for every tiny component.

## A-006 — Consistent naming conventions
- **Status:** Agreed, documented in `CODE_STYLE_GUIDE.md` v0.1.
- **Choice:** PascalCase components and component folders; camelCase functions, data files and utilities; matching `.module.css`, `.data.ts`, `.types.ts` suffixes, and `useX` hooks.
- **Reason:** Predictable naming, aligned with existing developer habits.

## A-007 — TypeScript guidelines
- **Status:** Agreed as revisable v0.1 defaults.
- **Choice:** Strict TypeScript, avoid `any` and unjustified assertions, explicit types for domain boundaries, sensible inference locally, `type` by default.
- **Reason:** Prevent AI from bypassing type safety to make code compile.
- **Caveat:** Learn unfamiliar type constructs during relevant implementation tasks, not as a prerequisite quiz.

## A-008 — React and Next.js component guidelines
- **Status:** Agreed as revisable v0.1 defaults.
- **Choice:** Functional components, Server Components by default, small Client Component boundaries for interactivity, props for explicit data dependencies, local state, composition, and hooks when actually useful.
- **Reason:** Keep the application simple and avoid unnecessary browser JavaScript or abstraction.
- **Caveat:** FAQ may use native `details` without client-side JavaScript; exact internals remain to be designed.

## A-009 — Progressive understanding and reviewability
- **Status:** Agreed learning principle.
- **Choice:** Decide what and why during design; investigate unfamiliar concrete syntax/APIs during implementation; require a clear explanation and review before accepting AI-generated code.
- **Reason:** Deepen knowledge as the actual need arises rather than front-loading unrelated quizzes.

## Historical planning milestone

Contact-form responsibility boundaries and the Server Action choice were subsequently agreed in A-010–A-017 below. Email provider, privacy/spam policy and the exact submission contract remain open.

## A-010 — Shared phone validation helper
- **Status:** Agreed.
- **Choice:** Own a reusable `validatePhoneNumber` function wrapping `libphonenumber-js`; browser and server can reuse its rule logic.
- **Reason:** Avoid duplication and isolate dependency details. Server revalidates untrusted input independently.

## A-011 — Server Action for website contact submission
- **Status:** Agreed for MVP.
- **Choice:** Use a Next.js Server Action as the submission boundary; no Route Handler until a separate HTTP API is needed.
- **Reason:** One form within one Next.js app.

## A-012 — Server Action as coordinator
- **Status:** Agreed principle.
- **Choice:** Delegate contact validation and email notification delivery to focused functions; keep the action readable.
- **Caveat:** Avoid classes and needless layers.

## A-013 — Structured submission result
- **Status:** Agreed concept, precise type pending.
- **Choice:** Distinguish success, field validation errors, and delivery errors; handle lost responses separately.
- **Reason:** Show field-specific guidance and truthful status.

## A-014 — Validate on submit, then update visible errors
- **Status:** Agreed.
- **Choice:** No initial error noise; on submit show relevant field errors together and update them while correcting.
- **Reason:** Usable, non-disruptive UX.

## A-015 — Single form draft state object
- **Status:** Agreed.
- **Choice:** Keep name, country, phone and comment in one draft-value object; error and submission feedback are distinct concepts.
- **Reason:** Fields form one logical draft.

## A-016 — useState rather than useReducer for the draft
- **Status:** Agreed for MVP.
- **Choice:** Start with React `useState`; adopt more advanced state tools only for a demonstrated need.
- **Caveat:** Do not duplicate pending/result state already owned by React form APIs.

## A-017 — Reset draft only on confirmed success
- **Status:** Agreed.
- **Choice:** Clear values and restore Moldova default only after provider-acknowledged success; retain input after failure or unknown result.
- **Reason:** Avoid user re-entry and false success claims.

## W-001 — Solo learning Git workflow
- **Status:** Agreed working default; refine after project initialization.
- **Choice:** Keep `main` stable; make small `feature/*` branches, review diff, run checks, commit using Conventional Commits, merge and push after verification. PRs are optional rather than mandatory per tiny task.
- **Reason:** Reviewable steps with minimal bureaucracy.

## W-002 — AI execution boundaries
- **Status:** Agreed working default.
- **Choice:** One authorized task at a time; no new dependencies, unrelated refactors, architectural shifts, push/deploy or bypassed checks without approval. Report changed files, checks and limitations.
- **Reason:** Human retains architectural responsibility; AI implementation is auditable.

## Next discussion point

Use `IMPLEMENTATION_PLAN.md` to start with the smallest foundation task. Resolve provider, exact validation rules, safe retry, privacy and abuse controls when their dependent tasks arrive.

## A-018 — Shared Header and Footer in RootLayout
- **Status:** Agreed on 2026-10-29; implementation pending.
- **Choice:** Render the shared `Header` and `Footer` in `src/app/layout.tsx`; compose home-only sections in `src/app/page.tsx`.
- **Reason:** Anticipated additional pages, consistent site shell, and clear separation of route-specific content.
- **Tradeoff:** Future pages that should not share this shell may require route groups/nested layouts or a revised structure.

## W-003 — Foundation review and documentation source of truth
- **Status:** In progress.
- **Choice:** Repository `TrixterXD/math-bac-landing` is private, on `main`, with initial foundation commit `e5d96f5`. Initial Next.js/TypeScript/Biome setup exists. Human review of major configuration and CSS files is positive; full acceptance still needs final checks.
- **Reason:** Keep implementation status and documentation aligned. Use root-level `AGENTS.md` as active agent instructions and the four companion Markdown documents as reference.
- **Note:** Existing task IDs in `IMPLEMENTATION_PLAN.md` remain stable even though the executor combined foundation setup steps under its label TASK-001.
