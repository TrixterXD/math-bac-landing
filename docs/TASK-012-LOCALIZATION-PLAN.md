# TASK-012A — Romanian/Russian localization architecture audit

**Status:** planning only; implementation and translations require approval.

**Baseline:** `main` at `b3c879b` (PR #8 merged). Fetched `origin/main` and confirmed there were no incoming commits. The pre-existing untracked `docs/TASK-011-RATE-LIMITING-PLAN.md` is untouched. No dependency installation, application changes, email sends, commits, pushes or deployments.

## 1. Recommendation

Use **two typed TypeScript dictionaries, locale-prefixed App Router URLs, and one preference cookie**. Do not install `next-intl` for this one-page, two-language scope yet.

- Romanian is the fallback: `/ro`.
- Russian is available at `/ru`.
- `/` redirects to a validated remembered preference, otherwise `/ro`.
- An explicit locale URL always wins over the cookie. `/ro` must not redirect to `/ru` just because the cookie says `ru`.
- Header shows language choices using endonyms, **Română** and **Русский**, not flags.
- Resolve locale once from the URL for page content, metadata, client props and Turnstile. Cookie is only an entry-route preference, never a second content-language source.
- Keep current validation rules and action result codes. Translate their presentation, not the security/delivery operations.

This matches the dictionary pattern in the installed Next.js internationalization guide. It avoids creating a custom translation framework: no generic dotted-key resolver, interpolation engine, global locale store, CMS, per-language component copies or client-only language flash.

### Comparison

| Approach | Advantages | Cost / limitations | Recommendation |
| --- | --- | --- | --- |
| Typed dictionaries + native Next.js routing | No new dependency; direct `messages.contact.submit` access; compiler checks; server-rendered localized HTML; serializable slices passed to existing client components | We own a small route/cookie policy and completeness tests. No ICU/rich-message tooling out of the box | **Use now**, given two locales and one landing page |
| `next-intl` | Established locale routing, server/client APIs, ICU plurals, rich messages, metadata helpers, typed-key support and tooling | Adds dependency/plugin/request configuration and integration concepts; routing, providers and cookie defaults still require deliberate choices. Official default locale cookie is session-scoped unless configured otherwise | Prefer if this grows into many routes, more locales, translator tooling or substantial plural/rich-text needs |

`next-intl` is a sound option, not rejected for security or size alone. If selected later, use its supported App Router setup rather than layering it over our own router. Configure persistent preference explicitly and review locale detection: its normal browser negotiation must not override the product's Romanian-first policy. No package compatibility with Next.js 16.4.3 was installed or tested during this audit.

## 2. Current-state audit

### Routing and shell

- `src/app/page.tsx` composes Hero → Team → Advantages → FAQ → Contact. One `/` route, no locale segments, Proxy, localization config, custom error/not-found UI, sitemap or robots metadata route.
- `src/app/layout.tsx` renders `<html lang="en">`, imports global styles/Manrope, renders shared Header, and exports outdated English metadata: **“Math BAC — Educational Prototype”** / **“Educational prototype. Landing page not implemented yet.”**
- Header and all five sections hard-code `lang="ru"`. Those must inherit the validated document language, not remain Russian on `/ro`.
- `NastyaProfile` intentionally marks Lorem Ipsum `lang="la"`; that is a genuine language override, not a locale bug. Decide whether to retain the Latin demo or replace it with approved localized placeholder copy.
- Header, profile dialog and form/widget are Client Components; static sections are Server Components. Preserve those boundaries.
- Header brand links to `/`; navigation uses stable anchors. Programs and Reviews links currently point to nonexistent `#programs` / `#reviews`. Programs is deferred; there is no implemented Footer, Programs or Reviews section to translate. Do not invent them or silently change navigation policy in localization work.
- `next.config.ts` is effectively empty. Do not add Pages Router `i18n` configuration for App Router routes.

### Form, security and delivery

- Form owns draft, field-error codes, submission state, duplicate-submit lock and token lifecycle. `MD` is the default phone country. **Locale must not change phone-country selection**, parsing/normalization, field limits or accepted countries.
- `validateContactForm.ts` returns language-neutral `required`, `too_long`, `invalid` codes keyed by fields. Good existing localization boundary; preserve it.
- `contactErrors.data.ts` maps 4 fields × 3 error codes to Russian strings, including repeated fallback labels. Server field errors and client errors already share the same rendering path.
- `submitContact.ts` returns `validation_error`, `verification_error`, `server_error`, `delivery_error` or `accepted`, not translated text. Leave its input/result/security behavior unchanged.
- `ContactForm.tsx` stores several Russian submission messages directly in state. During extraction, store the corresponding existing error/outcome key and render its message from the current dictionary; retain the distinction between provider/network uncertainty and known pre-delivery failures.
- `TurnstileChallenge.tsx` stores Russian security text, and passes hard-coded `language: "ru"` to the official widget. Translate both our inline messages and the vendor widget's language option.
- Siteverify is server-only and checks tokens/hostnames independently of locale. Managed mode, `appearance: "interaction-only"`, automatic execution, expiry, manual retry, callback cleanup and token refresh after every action attempt stay unchanged.
- Resend emails currently contain fixed Russian subject/body labels and use Russian country names from `countries.data.ts`. They go to the school, not the visitor. **Keep those emails unchanged** for this scope; do not translate visitor-provided name/comment or add locale to the notification.
- Rate limiting is only an untracked architecture proposal at this baseline, not an implemented status. If implemented before localization, add its actual UI outcomes to the inventory then.

## 3. Translation inventory

Use stable semantic keys and existing data IDs, not Russian display text as keys. This is a source/surface inventory, not an approved Romanian translation set.

### Static content and accessibility

| Current source | Inventory to move into both dictionaries |
| --- | --- |
| Root layout / metadata | Localized title and description; future approved social-card description; prototype/noindex policy |
| `Header.tsx`, `Header.data.ts` | Six navigation labels; main-navigation accessible name; brand-home accessible name; open/close menu labels; CTA; new language-selector label/current-language indication/switch warning if approved |
| `Hero.tsx`, `Hero.data.ts` | Intro pill; headline with emphasized segment; description; three benefit labels/details/optional ending; CTA; demo disclaimer; portrait alt |
| `TeamSection.tsx`, `team.data.ts` | Heading/emphasis; paragraph; demo disclaimer; list accessible name; four portrait alts keyed by teacher ID |
| `TeacherCard.tsx`, `NastyaProfile.tsx` | “О Насте” accessible label, visible badge and dialog heading; close action; demo biography heading and explanatory notice; explicit decision on Latin placeholder |
| `AdvantagesSection.tsx`, `advantages.data.ts` | Heading; three titles/descriptions keyed by `focus`, `support`, `format`; demo disclaimer |
| `FAQSection.tsx`, `FAQItem.tsx`, `faq.data.ts` | Heading; demo disclaimer; repeated “Демонстрационный ответ.” prefix; six complete questions and answers: `lessons`, `group-size`, `online-format`, `languages`, `starting-level`, `payment` |
| `ContactSection.tsx` | Heading/emphasis and invitation paragraph |
| `ContactForm.tsx` | Legend; name/phone/comment labels; required/optional markers; name/comment placeholders; country/code accessible name; submit and submit-again labels; success heading; prototype/real-test-email privacy warning |
| `countries.data.ts` | Names of **50 approved countries**, keyed by ISO code; stable calling codes stay library-derived. Keep existing supported-country policy and default MD |
| Routing fallbacks | Localized not-found/home labels; runtime error/retry labels where custom fallbacks are approved; never expose stack/provider text |

Brand **Math BAC**, BAC acronym, country codes, phone example `69 123 456`, icons, SVG paths, IDs, anchor names and field keys are not prose translations. Keep empty `alt=""` for genuinely decorative images; do not “translate” it into redundant screen-reader text. Translating prototype disclaimers must not turn demo claims into verified school facts. UI language availability does not establish lesson languages; retain the FAQ's unconfirmed-language wording.

### Validation and runtime copy

| Source | Distinct outcomes/messages |
| --- | --- |
| `contactErrors.data.ts` | Every field/error mapping, including name letter/separator guidance, country-list requirement, phone/international `+` guidance, optional-comment explanation, 100/1000-character limits |
| Form submission | Pending live-region message and pending button; accepted acknowledgment; field-error summary with count; verification rejected; server failure; provider/delivery uncertainty; thrown invocation/network uncertainty |
| Turnstile inline UX | Initial silent state; delayed/in-progress verification (including needed-for-submit fallback); missing setup/unavailable; script load failure; render exception; interaction required; post-interaction waiting; verification error; expiration; interactive timeout; retry button. Successful automatic verification remains silent |
| New switch UX | Language selector accessible name, current state, optional unsaved-draft confirmation, pending/uncertain-result explanation if switching is blocked |

Do not concatenate grammar fragments such as translated “field” + count. Keep a full neutral sentence template, e.g. a dictionary string with a single `{count}` token for “Fields to check: {count}”; replace just that known token locally. No generic parser is needed. If translators require natural count-dependent grammar, use `Intl.PluralRules` with explicit tested forms, or reconsider `next-intl`—do not implement Russian/Romanian plurals by checking `count === 1`.

For headings/benefits, use complete localized phrases with a small explicit emphasized segment where required by the design. Do not preserve Russian word order by translating fragments independently. Keep JSX markup in components; dictionaries contain plain strings, never translator-supplied HTML or `dangerouslySetInnerHTML`.

### Data and country-name source ownership

Keep icons, accent values, dimensions, image paths and stable item IDs in current `.data.ts` modules. Move display copy into dictionaries; join by ID at rendering. Replace `key={benefit.text}` with a stable ID when extracting benefits so translation is not identity.

Country names need care: the shared validator and notification currently import the same country list used by the UI. Recommended small migration:

- Keep allowed ISO codes/calling codes in `countries.data.ts`; localization must not alter membership, phone validation or normalization.
- Store `countries[ISO]` names once per locale in the dictionaries. Build display options on the server and pass serialized options to the form. Keep stable current code order initially; locale-specific alphabetical sorting is optional and needs approval. Browser/server sorting must not disagree.
- Preserve the notification's Russian country names byte-for-byte by resolving the same `ru.countries[ISO]` values in its existing lookup. This would be a narrow dependency/lookup adjustment, **not an email-output or sending-behavior change**. Add an exact-output regression test. If any delivery-module edit is disallowed during implementation, agree a compatible shared-data arrangement before migrating country names; do not maintain two competing Russian name tables.

Prefer explicit reviewed country dictionaries over `Intl.DisplayNames` initially: its names can vary across Node/browser ICU versions and deployment environments. No new country-name package is needed.

## 4. Text embedded in images

Visually inspected the listed text-bearing assets and teacher cards. A translation dictionary or localized alt does **not** translate pixels seen by sighted visitors.

| Asset | Embedded content / action needed |
| --- | --- |
| `hero/math-note.png` | “Математика может быть понятной и даже интересной!” |
| `hero/lesson-note.png` | “Больше, чем просто уроки” (rendered by Hero) |
| `team/team-note.png` | “Команда, которая вдохновляет и поддерживает” |
| `team/lesson-note.png` | “Продуманная система. Забота о каждом ученике. Реальные результаты.” (rendered by Advantages; retain demo-claim caution) |
| `faq/questions-note.png` | Invitation to write with questions |
| `contacts/contact-note.png` | Invitation to make BAC preparation calm, understandable and effective together |
| `team/nastya.png` | Portrait **plus baked-in “Настя / Основатель и преподаватель математики”**. Also reused inside the modal |
| `hero/note.png` | Older composite Russian note, currently not referenced by source. Do not spend time translating unused art unless restored |

`hero/math-pyramid.png` contains a mathematical formula, not language-dependent prose. The three fictional teacher portraits have no visible wording. Other arrows/crown/spark/plane graphics are non-prose decorations according to current usage; confirm remaining assets in final visual QA. Reference images under `design/reference/` are review materials, not runtime translations.

**Recommended minimal design-preserving option:** approved Romanian versions of the six active note images and Nastya's card, selected by locale; reuse existing Russian files. Keep asset paths in a small locale-to-asset mapping alongside structural data, not encoded inside translation sentences. Translator-approved art needs separate preparation/review; no assets generated in this audit. Note images can remain decorative only while their essential meaning is already covered by accessible DOM content; review the name/role card's alt or visible caption in both languages.

Alternative: separate portrait/art from text and render translated DOM captions. This is more maintainable long-term but changes typography/composition and needs a separate approved visual task. Do not hide Russian art on Romanian pages, clip the text away, or claim localized alt fixes it. Until localized assets or an approved DOM replacement exist, the page is **not fully localized**.

## 5. Routing, selection and persistence

### URLs and precedence

Use symmetric `/ro` and `/ru` rather than unprefixed Romanian plus prefixed Russian. One routing rule is easier to reason about and yields stable shareable URLs for both languages.

1. Valid locale prefix determines displayed language.
2. Only an unprefixed `/` entry consults the preference cookie.
3. Missing/invalid cookie chooses `ro`, regardless of browser `Accept-Language`.

This interprets “Romanian default” literally; browser-language auto-detection is not required. Keep old `/#contact` links working through the redirect and test fragment retention in a real browser. Use stable `#about`, `#advantages`, `#faq`, `#contact` on both pages. Brand goes to `/${locale}`, not `/` (which might redirect by preference).

Reject unsupported locale values with not-found behavior; never use an unchecked path value in dynamic imports. No fallback from an explicit `/ru` page to a half-Romanian dictionary. Only the locale allowlist maps to the two known dictionaries.

### One small `src/proxy.ts`

Next.js 16 uses **Proxy**, not a newly introduced `middleware.ts` file. Scope it narrowly to `/`, `/ro` and `/ru` (and normalize trailing slashes consistently). It should:

- Temporarily redirect root GET/HEAD to the cookie/default locale; preserve appropriate query data, never create a permanent cookie-dependent redirect.
- Persist the locale on actual localized page GET navigations. Only validated `ro`/`ru` values are stored.
- Never redirect/intercept Server Action POSTs; no change to action body/Origin/Host/security processing.
- Exclude static assets, `/_next`, metadata routes and other application paths. Avoid blanket “prepend locale to every URL” logic.
- Avoid writing a preference for Next.js Link prefetch/RSC speculative requests. Prefer ordinary language links/full document navigation initially; exclude/guard prefetch explicitly rather than letting link visibility change a cookie. A future client-routing optimization must retain this guarantee.

Cookie proposal: `math_bac_locale`, `Path=/`, `SameSite=Lax`, `HttpOnly`, `Secure` on HTTPS deployments, host-only, **one-year `Max-Age`**. It stores only `ro`/`ru`, no identity/token/form data. Exact duration/privacy classification needs approval. Set cookies in the Proxy response, not during layout rendering. No localStorage second source of truth. If cookies are blocked, explicit language URLs still work; returning to bare `/` falls back to Romanian.

Root preference redirects must be private/non-cacheable (proposed `Cache-Control: private, no-store`). Localized content remains URL-deterministic and can be statically generated; do not read cookies in its layout/page to select content. Set-Cookie handling can affect CDN caching: verify actual Vercel headers and ensure personalized preference responses cannot be replayed to another user. Never add public cache headers blindly. No shared mutable server-global locale.

### Header and in-progress forms

Use native links for the two language pages, with `lang`, `hrefLang`, translated group label and `aria-current` on the active choice. Do not use flags as language identifiers. Make choices visible/reachable on mobile, not only in a closed menu. Preserve a known current anchor on switch where practical; fragments are browser-only, so do not rely on Proxy to read them. Do not put a draft/token in a URL.

**Important open UX decision:** routing between locale root layouts can fully reload/remount the form. It must not silently lose a non-empty draft or make an uncertain send look safe to repeat.

Recommended minimal policy pending approval: switching on an untouched form navigates normally; a non-empty draft requires a localized discard confirmation; switching during pending submission is blocked; a delivery/network-uncertainty state retains its warning and requires explicit acknowledgment before leaving. This needs a small focused coordination between existing Header/form state—design that boundary only after approving the policy. Do not add global state or sessionStorage persistence speculatively. Browser Back/reload/closed tabs cannot be fully prevented by a language-switch guard.

If the product requires seamless draft-preserving switching, budget it separately before choosing full navigation: use an explicitly reviewed in-memory form boundary and code-based outcome state that survives locale change. Never persist personal contact drafts or Turnstile tokens to cookie/localStorage, and never reuse tokens across a widget lifecycle reset. Preserve pending locks and uncertainty warnings. No claim that route changes automatically preserve React state.

## 6. One translation source for server and client

Suggested minimal dictionary loading:

- `Locale = "ro" | "ru"`, one locale guard, one default constant.
- `Messages` type describes known sections and runtime keys; `contact.errors` mirrors the existing field/error-code types. Each dictionary conforms to that type (`satisfies`), with tests for matching IDs/placeholders/non-empty strings. No assertions to mask missing keys.
- `getMessages(locale)` is server-only and uses an explicit two-entry import map. Page/layout pass serializable subsets to Client Components: Header copy, profile copy, form/security copy and prebuilt country options. Do not pass functions or a server translator closure.
- Static sections receive their section's messages at composition; cards receive existing structural data combined with localized fields. No need for context/provider because there are only a few interactive boundaries.
- Metadata imports the same dictionary through the same server loader. Client and server validation both return the same existing codes, rendered via the selected `messages.contact.errors` table. No server-translated duplicate error messages.
- Keep runtime states as keys/codes where changing language could otherwise leave stale stored strings. During migration preserve branch behavior, error precedence and original meanings. For Turnstile this can be a small message-key union rather than a new state machine.

The selected dictionary is serialized only where the client needs it; static marketing/FAQ copy need not ship as a second full client dictionary. Do not import both dictionaries into the form or fetch translations after hydration. Pure dictionary/type modules must not import secrets or server-only delivery helpers.

## 7. Turnstile and Server Actions: localization without security changes

Cloudflare explicitly lists `ro` and `ru` as supported widget languages. Pass validated locale as the official render option; do not use `auto`, which can disagree with a visitor's explicit selection. Widen only the language option type to the locale union. Translate all inline challenge messages separately; do not manipulate the iframe's text/DOM.

If locale changes while a widget remains mounted, use the existing supported remove/render cleanup to recreate only the widget with the new language, clear the old token and reset requested-feedback state. With full locale-page navigation the component unmount already performs cleanup. Effect dependencies must include locale and any stable message source used in callbacks without recreating the widget on unrelated draft edits. Keep `handleToken` stable. Add regression tests for stale callbacks and expired tokens after switching.

Do not change widget mode, appearance, execution, timers, retry policy, success silence, expiration handling, Siteverify endpoint/hostname allowlist, validation rules, or Resend configuration. Both languages must still refuse submission with no verified token. Widget language is display configuration, not permission to send.

The existing action need not receive a locale: it returns neutral codes and the caller renders them using URL-selected messages. Do not add a locale cookie read to the action or translate unknown provider errors. Keep `src/app/actions/submitContact.ts` in place as a non-route module; moving page/layout files does not require moving the action or introducing an API route. Test actual action POST behavior from both locale URLs after introducing Proxy.

Email subject, sender/recipient, body labels, normalized values and accepted-versus-uncertain semantics remain identical. The only country lookup migration, if chosen, must be protected by exact-output tests. Future localized school emails or visitor confirmations are separate product decisions.

## 8. HTML language, metadata and SEO

- Move the actual root layout to `app/[locale]/layout.tsx` so it owns `<html lang={validatedLocale}>`, Manrope/global styles and shared Header. Avoid keeping a hard-coded outer `<html lang="ro">` that cannot become Russian. Next route params are async in this version; await and validate them.
- Generate static params for `ro` and `ru`; do not generate arbitrary locales. No cookie-dependent content in localized routes.
- Use localized title/description from the dictionary. Preserve prototype honesty; agree accurate titles/descriptions rather than inventing real school credentials/results. Manrope currently has Latin/Cyrillic subsets; verify Romanian **ă â î ș ț** and Cyrillic glyphs in the built font, not just source config.
- Once the canonical production origin is approved, set `metadataBase`, each locale's self-canonical URL, and reciprocal `alternates.languages` for `ro` and `ru`. Use `/ro` for `x-default`, not the cookie-dependent `/`. Do not derive canonical hosts blindly from request headers or use ephemeral Preview URLs as production canonicals.
- If a sitemap is approved, list both stable URLs and their language alternates. No existing sitemap, Open Graph art or robots policy was found. Do not fabricate social-card assets or enable indexing as a side effect of localization.
- Prototype/Preview indexing policy is unresolved. Recommend Preview/prototype noindex until commercial content/privacy approval; developer must approve the production indexing gate.
- Localized 404/error surfaces need explicit checks. Next's generated English fallbacks do not meet a claim that the whole journey is localized. With a dynamic root layout, unmatched routes have special behavior; the installed guide describes experimental `global-not-found`. Do **not** enable that experimental feature silently. Start by testing supported locale not-found handling; agree a Romanian global fallback and whether a targeted catch-all is needed. This is a routing acceptance decision, not permission for a broad error-system refactor.

## 9. Responsive and accessibility acceptance

Text expansion is expected; do not freeze Russian line breaks into Romanian prose.

- Header currently uses no-wrap navigation and CTA, large fixed gaps, a sticky/clipped desktop container, and a 64rem switch to mobile. Adding a language selector changes its width budget. Test both languages just above/below the breakpoint; move to the existing mobile layout earlier if needed, not shrink labels or drop links without approval.
- Hero has explicit headline segments, a `<br>` in description and positioned art. Translate complete phrases and verify wrapping without pushing content under the portrait/decorations. Contact heading also has a forced break; make language-sensitive layout decisions from screenshots rather than literal Russian line positions.
- Team badge is no-wrap and the dialog has a constrained scroll area. Test longer Romanian badge/close labels, focus return, Escape and small-height screens.
- FAQ questions must wrap without squeezing the plus icon. Preserve native exclusive `<details name="faq">`, sequential mobile reading order and keyboard behavior.
- Phone country select uses ellipsis in a narrow selector. Test the longest country labels and native expanded options. Keep the full accessible label and telephone code; do not change allowed countries or remove names to fit.
- Form success heading, warnings, field errors and retry labels must wrap. Keep `aria-live="polite"`, atomic announcements, IDs/`aria-describedby`, focus management and touch target sizes. Test actual Managed challenge interaction in both locales; no CSS hiding/clipping.
- Start visual checks at 360/390px, 768px, 1024px and 1440px, plus 200% zoom. Use real translated text and pseudo-expanded test copy for stress. Do not claim CSS inspection proves no overflow.

## 10. Proposed small project structure

```text
src/
  proxy.ts                         # narrow GET entry redirect/preference policy
  i18n/
    locales.ts                     # ro/ru guard + default; safe in client/server
    messages.types.ts              # explicit dictionary shape; existing error codes
    getMessages.ts                 # server-only explicit locale import map
    ro.ts                          # Romanian strings, including country labels
    ru.ts                          # extracted current Russian strings
  app/
    [locale]/
      layout.tsx                   # locale root html, font, Header, metadata
      page.tsx                     # existing section composition with copy props
      not-found.tsx                # localized locale-route fallback, verify context
    actions/submitContact.ts       # stays; neutral security/delivery result codes
    globals.css                    # stays; adjust layout only from scoped QA findings
  components/                      # existing components + .data.ts; copy via props
```

No `app/page.tsx` is needed once Proxy redirects `/`; all visitor pages live below the locale layout. Validate this root handling in `next build`/route tests before removing the old files. Unmatched global routes/error fallback structure is an explicit stage-1 decision (above), not implied solved by the sketch. Dictionary-specific tests belong beside these small modules or in the existing mock script pattern; do not install a second test framework without approval.

Active asset translations stay under `public/images/<section>/` with explicit Romanian variants (e.g. `contact-note.ro.png`). Existing Russian paths need not be renamed. Any fallback/catch-all file and narrow email country-lookup adjustment must be listed in the approved implementation task before editing.

## 11. Small implementation stages

1. **Approve decisions/copy scope:** prefixed routes, cookie policy, default precedence, filled/pending-form switching policy, image strategy, canonical host/indexing and global fallback behavior. Identify a Romanian/Russian reviewer; name/transliteration and unverified claims need owner approval.
2. **Dictionary foundation and audit closure:** extract Russian copy; add reviewed Romanian counterparts with matching types/keys/IDs. Include all error/security/accessibility strings and country labels. No security logic changes. Key/placeholder tests first.
3. **Routing shell:** locale root layout/page, narrow Proxy, persistent preference and header control; validate `/`, explicit locale precedence, cookie/prefetch handling, unsupported routes, correct HTML language and metadata. Use mocked delivery while exercising both action URLs.
4. **Static sections + assets:** wire section/card messages, profile dialog, image variants and localized alt. Preserve demo disclaimers and existing business facts. Review layouts with real text.
5. **Form and security UX:** dictionary-backed form errors/outcomes and widget language; implement only the approved switch/draft policy. Preserve duplicate lock, all error drafts, token expiry/retry/refresh and uncertainty warnings. Re-run existing server/delivery tests unchanged in meaning.
6. **Acceptance:** lint, typecheck, production build, dictionary/routing/mock tests; developer-led responsive and keyboard/screen-reader checks; controlled real Turnstile checks with email mocked/disabled. No real email, commit or deployment without separate approval.

Each stage is a separately approved small task. Do not build the whole localization system or refactor unrelated modules merely because this plan lists them.

## 12. Test strategy

### Automated, with mocked external requests

- Both dictionaries have identical key/ID sets, non-empty strings, matching known placeholders, all 12 field-error entries, all 50 country labels and all real action/challenge outcomes. Stable data IDs and supported-country/calling-code set remain unchanged.
- Locale guard rejects unknown/prototype-property inputs. Explicit `/ro` and `/ru` override cookies; fresh `/` defaults to Romanian even with Russian `Accept-Language`; valid remembered Russian redirects to Russian; invalid/blocked/expired cookie falls back safely. No redirect loops.
- Actual page navigation sets persistent preference; link prefetch, static assets and Server Action POSTs do not. Test cache headers and cookie attributes on HTTPS and localhost. Test query/hash behavior, reload/back and cookie-disabled use.
- Server-rendered document language, heading, title/description and client labels match, with no English/Russian flash on Romanian hydration. No section-level stale `lang="ru"`. Metadata canonical/alternate URLs agree and indexing policy remains intentional.
- Both client and mocked server validation errors resolve from identical field codes. All provider/server/verification/transport outcomes retain distinct truthful localized messages. Draft/pending/success/reset behavior remains as before.
- Mock Turnstile render gets `language: "ro"` / `"ru"`; Managed/appearance/execution options unchanged. Loading delay, missing configuration, interaction, failure, expiry, timeout, retry, success silence, stale callbacks and token clearing still work. A locale change never authorizes submission or reuses a stale token.
- Existing fetch-mocked validation/Siteverify/Resend tests continue to assert hostname checks, malformed/spent tokens rejected, correct fixed recipient/subject/body, no retries and no send on verification failure. Localization must not introduce locale-dependent validation.
- Exercise actual Next.js action POSTs from both locale routes with intercepted/mocked email transport. Unit-handler tests alone cannot establish Proxy/action compatibility.

### Human/browser acceptance

- Native-language review of Romanian diacritics, Russian grammar, all placeholders, warning semantics, country names, name spelling and image text; translations are not approved merely because keys compile.
- Header keyboard/mobile operation, current-language announcement, dialog focus/Escape/return, FAQ order, field errors/live announcements, correct document language and 200% zoom in both locales.
- Test approved switch behavior with untouched/filled/invalid forms, pending request, accepted state and uncertain delivery result; never send a duplicate as a navigation side effect.
- Inspect active localized images for residual Russian pixels on Romanian pages, including the modal's Nastya card. No untranslated business claims or hidden art workarounds.
- Real vendor widget language/accessibility in an authorized isolated setup, **with delivery mocked or disabled**. Browser/OS-native form controls and platform network/browser error pages are not entirely application-controlled; document those boundaries.

## 13. Open decisions and risks

1. Approve custom typed dictionaries versus `next-intl`; recommendation is custom until complexity warrants the library. No dependency has been installed.
2. Confirm `/ro` + `/ru` and literal Romanian-first default, cookie name/one-year retention and treatment of direct locale links as remembered preference. Cookie persistence is browser/domain-specific, not cross-device.
3. Decide filled/pending/uncertain-form switching policy before implementing Header coordination. Seamless draft retention is not automatic and must not weaken token or pending behavior.
4. Approve/provide Romanian art and Nastya-card text; choose reviewed name/role spelling. Missing art is a localization acceptance blocker, not solved by alt text.
5. Approve translations and business wording; preserve demo markings. Website languages are not a promise of teaching languages.
6. Approve country-source migration if needed for single-source labels; notification email output must stay identical. Otherwise settle an alternate compatible data layout first.
7. Confirm canonical production domain, Preview/prototype indexing policy, sitemap scope and localized/global error/not-found behavior. Do not enable experimental routing features silently.
8. Header width may require a scoped breakpoint/layout adjustment. No browser fit or Romanian font-subset guarantee was established by source inspection.
9. If rate limiting lands first, localize its actual new statuses and update dictionary/tests; the planning document is not runtime behavior.

## 14. Sources and verification performed

Inspected routing/layout, all rendered section/component/data files, validation/action/delivery code and current tests, locale-relevant CSS, metadata/configuration, active text-bearing PNGs and relevant unused art. Checked official Next.js 16.4.3 installed internationalization/cookie/fallback guidance, and official next-intl and Cloudflare documentation via HTTPS:

- [Next.js App Router internationalization](https://nextjs.org/docs/app/guides/internationalization) — locale segments, dictionary loading, root layout and static params.
- [Next.js Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy), [cookies](https://nextjs.org/docs/app/api-reference/functions/cookies), [metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found).
- [next-intl App Router setup](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing), [routing configuration/cookies](https://next-intl.dev/docs/routing/configuration), [server/client messages](https://next-intl.dev/docs/environments/server-client-components).
- [Turnstile widget configuration/language](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/) and [supported languages (`ro`, `ru`)](https://developers.cloudflare.com/turnstile/reference/supported-languages/).

This is a plan, not a working localization. No application lint/typecheck/build/tests, browser rendering, translation acceptance, deployment-cookie/cache experiment or live challenge test was run for this documentation-only task. The checks above are proposed future acceptance criteria. Final verification for this task is document review, whitespace check and confirmation that only the requested document was added.
