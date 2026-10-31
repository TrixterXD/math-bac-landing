# Contact notification delivery — controlled prototype only

`ContactForm` calls `submitContact` only after client validation passes. The action
checks the runtime payload, reuses `validateContactForm`, verifies Turnstile with
Cloudflare, and passes only normalized data to the server-only
`sendContactNotification` function. Mandatory security configuration and local testing:
[contact-security.md](contact-security.md). Missing protection configuration blocks delivery. No database, retries, or persistence are used.

## Configuration

Set these in the repository-root `.env.local` (already ignored by Git), or in the
server environment. Never use `NEXT_PUBLIC_` or commit actual values:

```dotenv
RESEND_API_KEY=<your server-side Resend sending key>
CONTACT_NOTIFICATION_EMAIL=<one explicitly authorized test inbox>
```

Do not include angle brackets in actual values. Configure a single recipient,
not a comma-separated list. Applicants cannot choose or override recipients.
Missing/blank configuration returns `delivery_error` without contacting Resend.
Keep `RESEND_DEBUG` unset or false: this SDK mode logs raw provider errors, so the
notification function refuses to send when it is true. Leave `RESEND_BASE_URL`
unset so the SDK uses the official Resend API.

The temporary sender is `onboarding@resend.dev`. Resend's test-domain restrictions
normally limit this to the email associated with the Resend account. Confirm the
configured recipient is permitted; a different recipient can be rejected. A
verified sending domain and approved sender are required before general use.

The email is Russian plain text, identifies the Math BAC prototype, and includes
name, E.164 phone, selected country, and a comment only when supplied. Applicant
content never becomes HTML, recipient, subject, or other message headers.

## Outcomes

- `validation_error`: shared server validation failed; no provider call.
- `verification_error`: Turnstile was absent, invalid, expired, spent, unavailable,
  misconfigured, or returned an unapproved hostname; no Resend call.
- `accepted`: Resend returned a message ID without an error. This is provider
  acceptance, not proof of inbox arrival or reading.
- `delivery_error`: missing configuration, provider rejection, missing message ID,
  timeout, or transport failure. A timeout/lost response can leave the send outcome
  unknown; this status must not be presented as proof that no email was sent.
- `server_error`: an unexpected action-level failure; no internal details returned.

Responses contain no applicant data, message body, provider errors, or credentials.
No automatic retry is performed; the request has a 15-second timeout. Retry and
idempotency policies remain open despite completed client integration and must be reviewed before broader access.

## Isolated unit tests (PowerShell, Node.js 24)

These tests replace fetch with mocks and overwrite provider configuration with
synthetic values. They do not load `.env.local` or make real API requests.

```powershell
npx tsc --outDir .contact-tests --noEmit false --incremental false --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck --strict --target ES2017 src/lib/validateContactForm.test.ts src/lib/sendContactNotification.test.ts src/app/actions/submitContact.test.ts
if ($LASTEXITCODE -ne 0) { throw 'Test compilation failed' }
$previousNodePath = $env:NODE_PATH
try {
  $env:NODE_PATH = Join-Path (Get-Location) 'node_modules/next/dist/compiled'
  node --conditions=react-server --test .contact-tests/lib/validateContactForm.test.js .contact-tests/lib/sendContactNotification.test.js .contact-tests/app/actions/submitContact.test.js
  if ($LASTEXITCODE -ne 0) { throw 'Tests failed' }
} finally {
  $env:NODE_PATH = $previousNodePath
  Remove-Item -Recurse -Force .contact-tests
}
```

The standalone Node runs resolve `server-only` to Next's bundled marker under the
`react-server` condition. In the app, Next provides the normal build-time boundary.
These tests exercise the action function and SDK transport, not Next's HTTP action
serialization, origin protection, or deployed runtime.

## Exactly one authorized live smoke test

**Do not run the sending command without explicit developer authorization.**
Review `.env.local` privately, confirm the single recipient with the developer,
and ensure all draft values in `scripts/contact-smoke.ts` are synthetic. The
example phone is structurally valid, not guaranteed unassigned; the email explicitly
instructs the recipient not to contact it.

Compile locally first (this does not send):

```powershell
npx tsc --outDir .contact-smoke --noEmit false --incremental false --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck --strict --target ES2017 scripts/contact-smoke.ts
if ($LASTEXITCODE -ne 0) { throw 'Smoke-test compilation failed' }
```

Before running, configure Turnstile and privately set `CONTACT_SMOKE_TURNSTILE_TOKEN`
to a fresh matching token as described in [contact-security.md](contact-security.md).
The script cannot bypass verification and refuses a missing token.

After authorization, execute this block **once** from the repository root:

```powershell
$previousNodePath = $env:NODE_PATH
try {
  $env:NODE_PATH = Join-Path (Get-Location) 'node_modules/next/dist/compiled'
  node --env-file=.env.local --conditions=react-server .contact-smoke/scripts/contact-smoke.js --send-one-test-email
} finally {
  $env:NODE_PATH = $previousNodePath
  Remove-Item -Recurse -Force .contact-smoke
}
```

Existing process environment values take precedence over `--env-file`; remove
unintended overrides privately before testing. The script submits one synthetic
request to the existing action, sends at most one email to the configured recipient,
and prints only its status. It refuses to send without the explicit flag. There
is no test route or endpoint. Inspect the configured inbox and Resend dashboard
privately to distinguish acceptance from delivery. Do not automatically rerun on
failure or uncertainty: first investigate whether the original message was accepted.

The developer reports that one authorized live smoke test passed before TASK-010.3C.
No additional live send is authorized by the client-integration task. Before exposing
delivery publicly, review anti-abuse/rate limiting, privacy, idempotency, and a
verified sender/domain.

## Localization/switching checkpoint — TASK-012D

`/ro` and `/ru` and client-side language navigation exist, but form/widget copy is
still Russian. The temporary shell lock blocks switching after any contact focus/use
or detected autofill for the rest of the visit, even after success.

The agreed next task is **not implemented**: allow empty/focused-empty and confirmed
success; confirm discarding a remaining draft, including after confirmed failure;
block pending; keep uncertain-delivery warnings from silently disappearing and avoid
accidental duplicates. Contact submission takes priority. The current generic error
state and feedback reset on editing do not fully satisfy that uncertainty contract.
See `TASK-012-LOCALIZATION-PLAN.md` for the state table. Rate limiting remains
deferred until evidence of abuse, not a production-ready safeguard.

## Client submission UX — TASK-010.3C

The draft remains one local state object. Field errors are separate, and submission
feedback has idle/pending/accepted/error states. A synchronous ref lock prevents
same-tick duplicate submissions; while pending, all controls remain visible but are
disabled so new edits cannot be lost to a successful reset. Country synchronization
still happens on phone blur and before submit. The client sends the current draft,
not a cached normalized copy; the server independently validates it.

All result cases are handled explicitly. Provider acceptance clears the draft,
restores MD and clears field errors. TASK-010.4A replaces the fields with a dedicated
confirmation in the same card, without claiming inbox delivery. Its heading receives
focus via a mount callback, while the existing polite live region announces the
supporting text. The reset-only “Отправить ещё одну заявку” button restores the empty
form and focuses Name through a guarded mount callback. It does not call the action. Errors and uncertain outcomes preserve entered values. There is
no automatic retry. A single polite live region carries either the field-error
summary or submission feedback, avoiding competing announcements.

### Manual integration checklist (mocked action only; no real emails)

No DOM/UI test library is installed. Existing unit tests cover authoritative
validation and mocked provider/action behavior, not React rendering and interaction.
During implementation, browser assertions intercepted all POST requests locally and
used synthetic action responses: invalid input, synchronous duplicates, pending,
acceptance/reset, server field errors, delivery/server errors and rejected invocation
were checked without sending emails. These were ad hoc checks, not a committed UI
regression suite. Use a separately approved UI mocking harness to repeat the checklist;
do not replace these checks with repeated live sends or a public test endpoint.

- Empty/invalid submit: field errors appear, and zero Server Action calls occur.
- Valid MD/RO/DE/GB drafts: exactly one action invocation, correct current country
  and unchanged phone text. A supported international number synchronizes country.
- Hold the mocked action unresolved and dispatch submit twice in the same tick:
  only one invocation. Sending label and disabled controls remain visible.
- Resolve with `validation_error`: returned errors are associated with controls;
  values are unchanged and correction works.
- Resolve with `accepted`: dedicated confirmation, no visible fields, heading focused,
  and polite supporting text. Click “Отправить ещё одну заявку”: empty fields, MD,
  no stale feedback/errors, Name focused, and zero additional action calls. Fill and
  explicitly submit again: exactly one new action call.
- Resolve with `delivery_error` or `server_error`, then reject the action promise:
  friendly feedback, no technical details, all values retained, no automatic retry.
- At 360px, 390px and 1440px: inspect long feedback wrapping, form bounds, keyboard
  focus, and the single live region with an assistive-technology check.

A directly callable email action is now part of the page. Restrict preview access
to authorized testers until anti-abuse/privacy safeguards are reviewed.
