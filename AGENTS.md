# AI Development Rules — Math BAC Landing Page

> Version: **0.2** · Status: agreed working process · 2026-10-30

## Role
The developer owns scope, product decisions, architecture, review and acceptance. AI implements one approved small task at a time and may challenge decisions with reasons; it cannot silently change them.

## Before coding
1. Read `PRODUCT_SPEC.md`, `DECISIONS.md`, `CODE_STYLE_GUIDE.md`, and the active task in `IMPLEMENTATION_PLAN.md`.
2. State goal, allowed files, dependencies, acceptance checks and unresolved choices.
3. If essential requirements conflict, explain and ask rather than silently guess. Avoid turning every implementation detail into a blocking question.
4. For visual implementation tasks, read `DESIGN_GUIDE.md`
   and inspect `design/reference/landing-desktop.png`.
   When a component-specific reference exists, inspect it as well.
   For Header tasks, use `design/reference/header/image.png`.
   Follow approved design decisions without inventing business
   claims or unapproved functionality.

## Documentation and localization status
- Distinguish source-inspected implementation, checks actually run, agreed next-task behavior and deferred features. A plan or open PR is not a production-readiness claim.
- TASK-012D is documentation-only. The agreed language-switch contract is in `docs/TASK-012-LOCALIZATION-PLAN.md`; do not implement it without the next task's approval. Contact submission takes priority over language switching.
- Romanian is default, Russian alternative. Route/dictionary foundations and client-side switching exist; complete section/asset translation remains pending. The contact-use lock is temporary, not the final UX contract.
- Rate limiting is deferred until evidence of abuse; the existing proposal does not authorize dependencies or infrastructure.

## During implementation
- Modify only the agreed scope; avoid unrelated refactoring and cosmetic churn.
- Do not add packages, change architecture, disable type checks, introduce `any` or assertions to suppress problems, or alter business facts without approval.
- Never expose secrets in browser code, logs, screenshots or repository files.
- Keep mock content clearly identified; do not invent real student outcomes or credentials.
- Use the established naming, CSS Modules, local-state and Server Component defaults.
- Write the smallest coherent, readable implementation; do not build the rest of the project.

## QA execution boundaries
- For small visual changes, run targeted static checks and hand over for developer-led responsive inspection; do not create or run lengthy browser QA automation without separate developer authorization.
- Production build and broader responsive/accessibility QA remain part of the relevant acceptance gate; never report them as passed if they were not run.
- If a reference shows a required element, do not silently hide it based on a predicted layout issue. Attempt the agreed layout or report the concrete blocker for developer review.

## Completion report (required)
1. Files added/changed and the reason for each.
2. Explanation of any non-obvious mechanism or new pattern.
3. Checks actually run and results; explicitly say if not run.
4. Manual verification steps and edge cases.
5. Unresolved risks, assumptions, proposed follow-up (not implemented without approval).

## Developer gate
Developer examines diff, explains significant code, tests locally, requests fixes if necessary, then approves commit/merge/push. Do not automatically commit, push or deploy.

## Code review checklist
- Scope and functional acceptance criteria
- Readability and single responsibilities
- Strict TS and safe external data handling
- React Server/Client boundaries and minimal state
- Mobile UX and keyboard/semantic accessibility
- Errors, loading, privacy, spam and provider failures where applicable
- No unnecessary dependencies, abstractions or unrelated edits
- No claims of tests performed unless executed

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
