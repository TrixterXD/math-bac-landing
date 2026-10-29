# Code Style Guide — Math BAC Landing Page

> Version: **0.4** · Updated: **2026-10-29**  
> Status: **Agreed working guidelines; may evolve after review**  
> Applies to the educational prototype, not a final customer contract.

## 1. Philosophy

- Optimize for readability, understandable responsibility boundaries and incremental code review, not cleverness.
- Avoid premature abstractions, unused dependencies, unnecessary wrapper components and global state.
- AI implements **one small agreed task at a time**; the developer reviews, explains and tests before accepting and committing.
- If a rule becomes counterproductive, propose a reasoned change and update this guide and the decision log.
- Unfamiliar techniques are allowed if they solve a real problem; explain them when introduced.

## 2. Naming conventions (agreed)

| Entity | Convention | Example |
|---|---|---|
| React component | PascalCase | `ProgramCard.tsx` |
| Component directory | PascalCase | `ProgramsSection/` |
| CSS Module | Component name + `.module.css` | `ProgramCard.module.css` |
| Data module | camelCase + `.data.ts` | `programs.data.ts` |
| Types module (when needed) | camelCase + `.types.ts` | `program.types.ts` |
| Utility module | camelCase | `formatPhoneNumber.ts` |
| Custom hook | `use` + PascalCase | `useContactForm.ts` |
| Function / variable | camelCase | `validatePhoneNumber` |
| Type / interface | PascalCase | `ContactFormData` |

Do not create a separate `.types.ts` file by default: extract only when there is a concrete sharing or readability benefit.

## 3. Project organization (agreed direction, not final tree)

- Organize primarily by technical role: `src/app`, `src/components`, `src/data`, `src/types`, `src/lib` **as needed**.
- Major landing sections live as separate components. Components with substantial local assets/styles may have their own directory.
- `app/page.tsx` can compose the sections directly. A dedicated `LandingPage` wrapper is optional and requires a reason.
- Mock collections reside separately from their display JSX.
- Example data flow: `programs.data.ts` → `ProgramsSection` via import → `ProgramCard` via a typed object prop.
- Do not pre-create empty folders to satisfy a diagram.

## 4. TypeScript (agreed v0.1)

- Enable strict type checking.
- Avoid `any` by default; handle unknown external input explicitly.
- Avoid unsupported `as` assertions, `@ts-ignore`, and disabled checks just to silence errors.
- Give application contracts explicit types; allow inference for obvious local expressions.
- Prefer `type` by default, but use `interface` where there is a concrete benefit.
- Introduce generics, discriminated unions and other constructs only when they make a task clearer; explain them at review time.

## 5. React and Next.js (agreed v0.1)

- Use function components and composition.
- Prefer Server Components for static page sections in the App Router.
- Use `"use client"` only for parts requiring client interaction/state; keep boundaries focused.
- Prefer local state near its consumer. No Jotai/global state for this MVP unless needs change.
- Prefer props for explicit child dependencies; don't force all static content to flow through the page component.
- Use custom hooks for a genuine reuse or clarity need, not merely to move a few lines.
- Native HTML controls may be preferable to JavaScript-heavy UI when they satisfy requirements (e.g. FAQ `details`).

## 6. Forms, validation and failure handling (principles; internals TBD)

- Keep presentation, input rules, server processing and delivery conceptually distinct.
- Client checks serve UX; the server independently validates untrusted input.
- Use `libphonenumber-js` for phone parsing/formatting/validation, with a custom UI and MD as default country; accepted phone values normalize to E.164.
- Never report a successful request merely because client validation passed.
- On known submission failure, preserve entered values and provide useful, nontechnical feedback.
- Centralized application-error-to-message mapping is **proposed**, not implemented or mandatory yet.
- Treat network uncertainty and duplicate submissions as open engineering issues.

## 7. Styling and accessibility (agreed direction)

- Use CSS Modules for component-level styles.
- Preserve semantic HTML, keyboard access, clear labels and responsive/mobile usability.
- Do not put actual unapproved claims or fake student results into production copy.
- Use the implemented Manrope and CSS custom properties in `src/app/globals.css`; visual choices and component-specific references are documented in `DESIGN_GUIDE.md`. Breakpoints follow content needs; contrast and responsive behavior require browser verification.

## 8. AI implementation and review protocol (agreed)

1. State the requirement and acceptance criteria for one small task.
2. Agree on any needed design decision before generating code.
3. AI changes only the agreed scope; it must describe additions, dependencies, assumptions and risks.
4. Developer reviews: correctness, responsibilities, naming, types, UX, error handling, accessibility and unnecessary complexity.
5. Developer can explain each important choice and request improvements.
6. Run appropriate local checks and a manual verification; commit only after passing.
7. Push to GitHub after verification as agreed; do not conflate a commit with a successful deployment.

**Do not:** generate the entire app in one pass, add dependencies without approval, bypass TypeScript errors, refactor unrelated files, invent product facts, or claim unexecuted checks have passed.

## 9. Pending decisions

- Exact form implementation signatures, notification transport and provider; contact form responsibilities and Server Action have been agreed.
- Specific input schema, error codes, safe retry/de-duplication, anti-spam measures, data privacy rules.
- Testing tools and complete project tree as needs emerge. Biome (including import organization) and Conventional Commits are selected.
- Further component-specific responsive design and contrast checks; foundational CSS tokens and Manrope are already implemented.

## 10. Change procedure

Every rule change should include: **old rule → new rule → reason → affected code**. Record meaningful architectural changes in `DECISIONS.md` and update `PRODUCT_SPEC.md` if user-visible behavior changes.

## 11. Contact form architecture decisions (agreed)

- Form UI: `ContactSection` owns section presentation; `ContactForm` owns input interactivity.
- `formData` is one `useState` draft with name/country/phone/comment. Keep errors and submission feedback conceptually separate; avoid duplicate status ownership.
- Reuse a focused phone validation function with `libphonenumber-js`; independently validate untrusted data in the Server Action.
- Server Action coordinates validation, notification delivery and a safe structured result; do not access provider secrets from Client Components.
- Field errors first appear after a submit attempt; previously shown errors can update during correction.
- Clear fields on confirmed success; preserve on error/unknown result.
- Exact filenames, action signature, helper extraction, metadata rules and retry/deduplication logic require a small, reviewed implementation decision when reached.

## 12. Git workflow v0.1

- `main` is the stable branch; use short `feature/*` branches for scoped changes.
- Suggested commits: `feat: add hero section`, `fix: correct phone validation`, `docs: update specifications`.
- Before merge: read the diff, explain substantive changes, run relevant typecheck/lint/build/test commands and manually verify affected behavior. Do not assert checks passed without running them.
- Push only after local verification and developer approval; deploy only after explicit approval. PRs optional for solo workflow.

## 13. Shared site shell (A-018)

- Put shared site `Header` and `Footer` in `src/app/layout.tsx` when implemented; keep home-specific section composition in `src/app/page.tsx`.
- This is a deliberate decision for likely future pages. If a route later needs a different shell, reconsider nested layouts or route groups instead of assuming the shell applies everywhere.

## 14. Companion documents

- `PRODUCT_SPEC.md`: user behavior, scope and product requirements.
- `DECISIONS.md`: decisions, alternatives and statuses.
- `IMPLEMENTATION_PLAN.md`: task order, dependencies, review and acceptance gates.
- `AGENTS.md`: the active AI scope, reporting and approval contract (currently holds the rules formerly named `AI_DEVELOPMENT_RULES.md`).

## 15. Image assets and visual references (Hero)

- `design/reference/` holds **review images** and must not become the source for rendering the website itself. The full-page reference is `design/reference/landing-desktop.png`; the Hero crop is `design/reference/hero/desktop.png`.
- `public/images/` holds **runtime assets**. The prepared portrait for the Hero is `public/images/hero/nastya-hero.png`, rendered with Next.js `Image` where appropriate; use responsive sizing and meaningful `alt` text.
- Keep the Hero copy, links and layout as semantic markup rather than flattening them into a background image. Do not accidentally render text from the reference as a bitmap.
- Do not create a generic image wrapper or asset registry unless actual repeated needs appear. Avoid unapproved packages and speculative asset generation.
- Treat generated portrait cutouts as edited imagery: verify likeness, quality, transparency and consent for public use. Do not depict fictitious team members as real staff.
- For TASK-005A change only Hero-specific implementation and minimal page composition; keep Header behavior and global tokens intact unless a concrete issue is discussed and approved.
