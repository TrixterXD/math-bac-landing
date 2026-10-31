# Contact notification delivery — controlled prototype only

`submitContact` is not connected to the browser form. It checks the runtime payload,
reuses `validateContactForm`, and passes only normalized data to the server-only
`sendContactNotification` function. No database, retries, or persistence are used.

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
- `accepted`: Resend returned a message ID without an error. This is provider
  acceptance, not proof of inbox arrival or reading.
- `delivery_error`: missing configuration, provider rejection, missing message ID,
  timeout, or transport failure. A timeout/lost response can leave the send outcome
  unknown; this status must not be presented as proof that no email was sent.
- `server_error`: an unexpected action-level failure; no internal details returned.

Responses contain no applicant data, message body, provider errors, or credentials.
No automatic retry is performed; the request has a 15-second timeout. Retry and
idempotency policies remain open before client integration or broader access.

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

No real smoke test was authorized or performed during implementation. Before
exposing delivery publicly, review anti-abuse/rate limiting, privacy, idempotency,
verified sender/domain, and client handling of uncertain outcomes.
