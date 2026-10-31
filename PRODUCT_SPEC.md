# Product Specification — Math BAC Landing Page

> Status: **Educational prototype / working hypothesis**  
> Version: **0.5**  
> Updated: **2026-10-29**  
> This is **not** an approved client brief. Validate all business-specific claims and requirements with Nastya before commercial deployment.

## Current implementation checkpoint — TASK-012D

This document preserves early product exploration below; historical TBDs are not all still open. Source inspection on `feature/localization-routing` confirms Hero → Team → Advantages → FAQ → Contact, shared validation, Server Action, Resend delivery and Turnstile. Programs is deferred (D-024); Footer is not implemented. Exact current validation/result rules live in source and `docs/contact-delivery.md`, not the preliminary tables below. No runtime verification was performed in this audit.

Romanian is default, Russian alternative. Typed dictionaries, `/ro` and `/ru`, localized Header/document language/metadata and client-side switching exist. Full page-section, form/widget and image translation is pending. The temporary contact-use lock blocks switching even after empty focus and after success; it is not the final product behavior.

**Agreed next task, not implemented:** allow switching on empty/focused-empty forms and confirmed success; require explicit draft-discard confirmation for a non-empty draft, including after confirmed failure; block pending submissions. Uncertain delivery warnings must not silently disappear, and accidental duplicate submissions must be avoided. Contact submission takes priority. See `docs/TASK-012-LOCALIZATION-PLAN.md` for the canonical state table.

Rate limiting is deferred until evidence of abuse. Privacy/legal approval, real content/asset permissions and public-release acceptance remain open; implementation is not production readiness.

## 1. Product concept

A responsive one-page website for a small educational business in Moldova preparing school students for the mathematics Baccalaureate (BAC). The founder, Nastya, teaches mathematics and leads several other teachers. **Lessons are delivered online** (information supplied during discovery).

The website serves two purposes:
1. Let visitors who already know the school quickly request contact.
2. Help visitors unfamiliar with the school learn enough to decide whether to reach out.

**Primary audience:** parents of prospective BAC students.  
**Primary conversion:** a contact request through a website form.  
**Positioning hypothesis:** a mathematics BAC preparation school led by a teacher and her team, not merely a solo tutor's personal page.

## 2. Project objective and method

The primary *learning* goal is to practice the end-to-end engineering cycle with AI as a small-step implementer and the developer as the technical decision-maker:

**Idea → Requirements → Architecture → Small task → AI implementation → Code review → Test → Git commit → Next task.**

Rules:
- Never generate the entire project in a single step.
- Discuss alternatives and tradeoffs before coding.
- Agree on a Code Style Guide and architecture rules before implementation.
- Review code for readability, types, responsibility boundaries, failure handling, and requirement coverage.
- Verify each completed increment locally before committing/pushing.
- Explain decisions in terms of the problem solved, mechanism, and reason for choosing the approach.
- Ask the developer to explain mechanisms back and suggest improvements.
- Avoid unnecessary dependencies and speculative architecture.

## 3. User Journey — canonical version 1.9

This is the **full cumulative journey**, not a shortened replacement. Update this section as product decisions evolve.

### Entry scenario A — TikTok
1. Parent watches Nastya's TikTok explanation of the school/benefits.
2. Parent follows a link to the site, potentially already willing to contact the school.
3. Parent may choose a language (Romanian default, Russian alternative), then quickly reaches the contact form without a full page read.
4. The hero presents Nastya’s portrait to support recognition from TikTok, clearly states online BAC mathematics preparation, and exposes the primary contact CTA without requiring a full read.
5. Parent proceeds to the shared contact form.

### Entry scenario B — recommendation
1. Parent hears about the school from another person.
2. Parent opens the landing page and wants to understand the offering.
3. Parent chooses a language, then sees the service and online format in the hero and may review teachers, advantages and FAQ (content subject to confirmation). Programs remains deferred pending discussion with Nastya.
4. Parent proceeds to the shared contact form when ready.

**Important:** both journeys are working hypotheses, not validated user research or hard user categories. TikTok visitors may still explore the page; referred visitors may contact immediately.

### Page exploration / information path (working hypothesis)

**Current agreed prototype section order:** Hero → Nastya and teaching team → Advantages → FAQ → Contact form. Preparation programs is deferred (D-024). Plus site header/navigation and footer.

- **Hero:** state online BAC mathematics preparation immediately; make contact CTA visible; use Nastya’s own approved photograph as the principal visual when available. Avoid a generic classroom/group-learning visual that might imply offline group lessons.
- **Fast journey:** Hero CTA leads directly to the contact form (typically a same-page anchor); visitors do not need to read all sections.
- **Research journey:** the other sections answer who teaches, why the approach may help, what is offered and practical questions before contact.
- **Mobile constraint:** heading, service description and CTA remain readily visible and usable; portrait sizing/layout must not obstruct contact access.
- **Credibility:** present only verified school/teacher achievements and accurate information.

**Temporary/demo advantages (not approved or verified as school claims):** supportive, low-stress learning; understanding mathematics rather than rote algorithms; students can ask questions without fear. These are placeholders for product/design exploration, **not factual promises about Nastya’s school**.

### Shared submission path
1. Parent enters name (required).
2. Parent selects phone country (Moldova by default) and enters a phone number (required).
3. Parent may leave an optional comment describing the student's class, difficulties, or preparation goals; suggestions must not become mandatory questions.
4. Client-side validation helps correct inputs; telephone parsing/normalization uses `libphonenumber-js`.
5. The application submits the request to the server.
6. The server independently validates all input and normalizes the telephone number to E.164.
7. On valid input, the server attempts to submit a notification through a delivery provider (working proposal: email).
8. Only after an appropriate successful provider acknowledgment does the server return a success outcome. Acceptance by the provider does not prove arrival in the school's inbox.
9. The UI displays a clear outcome based on the response.

### Error / uncertainty branches
- Invalid fields: show actionable errors; do not submit invalid data as if accepted.
- Delivery provider failure: explain that the request could not be confirmed; retain entered values; offer retry. An alternate messenger contact is **proposed, not yet approved**.
- Network interruption: avoid claiming success or definite failure when the result is unknown; preserve inputs. Retry can create duplicates without additional safeguards.
- Do not expose internal provider/stack errors to the visitor.
- **Proposed architecture concept:** map internal error categories to readable messages centrally, including a safe fallback for unknown errors. The exact categories, transport semantics and implementation remain to be studied during implementation.

### Intended completion
The school can access the parent's contact details and any optional context and follow up. The product must distinguish *form submitted*, *server accepted*, *delivery provider accepted*, and *actual delivery/read*.

## 4. MVP scope — current working definition

### Original MVP section exploration (content provisional; Programs later deferred)

The numbered list retains historical planning context; current composition is recorded above.
1. **Hero** — online BAC mathematics preparation, recognizable portrait of Nastya, primary CTA to form.
2. **Nastya and team** — human introduction and trust-building; actual bios/credentials pending.
3. **Advantages** — demo placeholders only: low-stress atmosphere, conceptual understanding, freedom to ask questions.
4. **Preparation programs** — use fictional basic BAC preparation and BAC intensive cards for UI prototyping; actual offerings are unknown.
5. **FAQ** — practical details, only when confirmed (or clearly fictional demo placeholders).
6. **Contact form** — main conversion (specification below).

Also include appropriate header/navigation, footer and social/contact links where confirmed. A separate methodology/results block is **not** yet part of the agreed section order; such information may be included within the relevant sections if substantiated.

Do **not** fabricate student scores, testimonials, teacher credentials, prices, guarantees, or company facts.

### Form data — preliminary contract v0.2

| Field | Required | Form representation | Server representation / purpose |
|---|---|---|---|
| Parent name | Yes | Editable text | Validated, whitespace-normalized text for addressing parent |
| Phone country | For phone input | Country selection, default `MD` | Used for parsing national input; validate allowed country values |
| Phone | Yes | User-entered text | Parsed/validated, E.164 string, e.g. `+37369123456` |
| Comment | No | Free-form textarea with supportive example | Optional, length-limited text for context |

Example helper text for comment: “Расскажите немного о вашей ситуации: в каком классе учится ребёнок, какие трудности возникают с математикой и какую цель вы ставите перед подготовкой.”

*Field length limits, country support, behavior on pasted international numbers, and exact validation criteria are not yet approved.*

### Initial functional requirements (draft)

| ID | Requirement | Status |
|---|---|---|
| FR-01 | Open/access the contact form | Proposed MVP |
| FR-02 | Fill required name and phone | Agreed |
| FR-03 | Optional contextual comment | Agreed |
| FR-04 | Client-side validation and useful field errors | Agreed principle |
| FR-05 | Independent server-side validation | Agreed |
| FR-06 | International phone input with country picker, MD default | Agreed for learning prototype |
| FR-07 | Parse/format/validate phone via `libphonenumber-js` | Agreed for learning prototype |
| FR-08 | Normalize accepted phone to E.164 | Agreed |
| FR-09 | Submit request for server handling | Agreed principle |
| FR-10 | Deliver request to school via provider | Required outcome; mechanism unconfirmed |
| FR-11 | Show successful vs failed submission truthfully | Agreed |
| FR-12 | Preserve field values on submission failure | Agreed |
| FR-13 | Provide loading state and prevent accidental repeat clicks | Proposed MVP |
| FR-14 | Responsive and keyboard-accessible UI | Required quality goal |
| FR-15 | Social links | Planned; specific platforms/addresses unconfirmed |
| FR-16 | Hero clearly communicates online BAC mathematics preparation | Agreed for prototype |
| FR-17 | Hero CTA navigates directly to contact form | Agreed for prototype |
| FR-18 | Use Nastya portrait as hero primary visual, subject to approved asset | Agreed design direction |
| FR-19 | Present founder/team, advantages, programs and FAQ in selected order | Agreed prototype structure; content pending |
| FR-20 | Keep hero offer and CTA accessible on mobile | Agreed quality goal |
| FR-21 | Use readable, centralized error-message mapping with unknown-error fallback | Proposed architectural approach; specifics deferred |

### Demo content strategy (agreed for the educational prototype)
- Business copy, program names, benefits and FAQs may be mocked to develop the UI and data model. Avoid treating them as verified school claims.
- Example program cards: **BAC — Basic Preparation** and **BAC — Intensive Preparation**. Their descriptions and bullet points are fictional.
- Nastya owns the final school-specific content and approves any actual portrait or testimonials before publication.
- The developer owns the UI, architecture, implementation, testing and deployment; do not prolong product discovery by inventing the school's marketing strategy.

## 5. Responsibility boundaries (conceptual)

- **UI / React:** present inputs; manage draft values and submission state; show helpful user-facing feedback.
- **Phone library:** parse, format, and check phone numbers according to available numbering metadata; it does not prove the number exists or belongs to the submitter.
- **Application/domain rules:** decide which input and actions the product accepts, error wording and UX policy; do not hide these rules inside a presentation component.
- **Server boundary:** distrust external input, validate again, normalize, coordinate delivery, and return a meaningful result.
- **Delivery provider:** accept and attempt delivery; provider acknowledgment is not equivalent to inbox delivery.

### Candidate technical stack
Next.js App Router, React, TypeScript, CSS Modules, Git/GitHub, Vercel; `libphonenumber-js` for phone logic. Server Action and Resend notification are implemented for the current prototype; refer to `docs/contact-delivery.md` for the current integration contract.

## 6. Agreed engineering architecture — working design v0.1

- Each major landing section is a separate React component (Hero, Team, Benefits, Programs, FAQ, Contact). `app/[locale]/page.tsx` composes home-specific sections directly; a redundant `LandingPage` wrapper is not required. Shared Header is rendered through `LocaleShell` in `app/[locale]/layout.tsx`; Footer remains pending (A-018, superseded path).
- Keep typed mock collections in separate `.data.ts` modules, apart from JSX.
- A section may import its data array directly; a child card receives one object via props (e.g., `ProgramsSection` → `ProgramCard`). This is a deliberate choice for static content, not a universal props policy.
- Prefer local React state for the contact form; do not add Jotai/global state to the MVP.
- Organize directories by technical role (`app`, `components`, `data`, `types`, `lib`) rather than full feature domains. Only create directories/files when needed.
- Use CSS Modules for component styles. Favor Server Components for static sections; isolate the Client Component boundary around interactive form UI. Native HTML interaction (such as `details`) can avoid a client boundary where appropriate.
- Source of truth for conventions: **`CODE_STYLE_GUIDE.md`**. Contact-form responsibilities and Server Action approach are implemented; the current contracts and delivery provider (Resend) are documented in `docs/contact-delivery.md` and source. The early design notes below are historical.

### Conceptual static data path
`programs.data.ts` → `ProgramsSection` (direct import) → `ProgramCard` (typed prop).

### Conceptual form responsibility boundaries
- Presentation and local state: contact UI, draft values, feedback and pending state.
- Validation: application rules and `libphonenumber-js` for phone behavior (details TBD).
- Server: authoritative validation and coordination of delivery (Server Action selected).
- Delivery: Resend notification adapter (implemented); provider acceptance does not prove inbox delivery.
- Error copy: current field-error mapping exists; localization of contact-form copy remains pending.

### Contact form decisions agreed after v0.3 (A-010–A-017)

- Share a dedicated `validatePhoneNumber` function between browser-side UX and authoritative server-side checks; use `libphonenumber-js` internally. No guarantee of phone ownership.
- Use **Server Action** as the landing page submission entry point (A-011), not a separate public Route Handler for the MVP. Do not assume it is secret or bypasses server-side validation.
- Treat the Server Action as a **thin coordinator**: invoke contact validation, then notification delivery, then return a safe result. Do not invent service classes or layers solely for architecture.
- Return a **structured result** for success, validation errors and delivery errors. The result contract and unknown network-outcome handling are implemented; consult current source and `docs/contact-delivery.md` rather than this historical conceptual sketch.
- Show the first field errors **after submit is attempted**, preferably together. Update visible errors as fields are corrected, rather than showing premature errors on first typing.
- Use one `useState` object for **draft values**: `name`, `country` (default `MD`), `phone`, `comment`; manage errors and submission feedback separately as needed. Avoid duplicate state if React/Next.js form hooks already own an equivalent value.
- **Confirmed success:** clear fields, restore default country, show acknowledgement. **Failure or unknown outcome:** preserve draft. Unknown outcome must not be described as certain failure.
- Treat program text, benefits, team bios and FAQs as clearly fictional mock data until Nastya supplies actual content; engineering rather than marketing discovery is the current scope.

### Canonical user journey update — v1.9 additions

The full entry scenarios and common submission stages above continue to apply. After the parent submits:

1. Before the first submit attempt, the UI avoids premature field-error messages.
2. After an attempt, client validation reveals applicable field errors; previously visible errors can update during correction.
3. After client acceptance, Server Action receives untrusted input and independently validates it; structured field errors return to the form when validation fails.
4. Following validation, the server asks the delivery provider to accept the notification; provider acknowledgement permits a *request-accepted* success message but does not prove inbox delivery.
5. On confirmed success, the form clears and reverts to `MD`; on known failure it keeps entered values, and on lost network response it preserves values without claiming certainty.
6. Safe retry/de-duplication, alternate contact, privacy and spam policy remain open until corresponding implementation tasks.

## 7. Non-functional considerations / pending requirements

- Mobile-first/responsive and accessible behavior.
- Security against untrusted requests; no sensitive tokens in client code.
- Spam and abuse mitigation.
- Privacy notice and handling/retention of parent contact data in the applicable jurisdiction; legal requirements require confirmation.
- Avoid duplicate submissions, including uncertain network outcomes.
- Error diagnosis/logging without unnecessary personal data exposure.
- Test strategy and production verification.
- No unnecessary architectural abstraction or dependency.

## 8. Historical engineering questions

Provider (Resend), validation rules, result codes and basic test tooling have since been implemented; use the current checkpoint and delivery/security docs. Safe retry/idempotency, privacy, business approval and release verification remain open. Rate limiting is deliberately deferred until evidence of abuse.

1. **Next engineering step:** use `IMPLEMENTATION_PLAN.md` to guide incremental implementation; finalize remaining detailed contracts at the corresponding tasks.
2. **Error policy later:** decide visitor-friendly fallback for unsuccessful delivery (retry, messenger, other); determine safe retry behavior.
3. Confirm specific phone rules and metadata choice (`min` vs `max`) for `libphonenumber-js`.
4. Define exact validation and normalization contract for name/comment/phone/country.
5. Define server response states, including unknown delivery outcome.
6. Server Action selected; design its exact submission signature and email-service integration during implementation.
7. Resend is selected and integrated; verify sender/domain and recipient configuration and successful processing in the intended deployment before launch.
8. Decide spam mitigation, duplicate prevention, and basic privacy treatment.
9. Confirm real programs, languages, formats, schedule, prices, team information, testimonials, social handles, and CTA wording with Nastya **later**.
10. Validate remaining detailed form rules, test tooling and release criteria during the corresponding plan tasks; refine guidelines as needed.

## 9. Workflow for updating this document

At the beginning of each new product/design step:
1. Read the **full canonical User Journey** and current open decisions.
2. Update the journey *cumulatively* if the agreed behavior changes; preserve both entry scenarios and all exception branches.
3. Move decisions from proposed → agreed only after discussion.
4. Add any substantive decision and its tradeoffs to `DECISIONS.md`.
5. Do not treat plausible assumptions as client-approved facts.
6. Preserve the complete contact submission and failure branches when summarizing the visible user journey; a shorter visual is only a view, never a replacement of this canonical sequence.
7. Record agreed architecture conventions in `DECISIONS.md` and `CODE_STYLE_GUIDE.md`; avoid silently promoting tentative technical choices into decisions.
