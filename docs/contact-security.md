# Contact protection — TASK-010.5A

Contact delivery is now gated by Cloudflare Turnstile. There is no client flag,
missing-key fallback, alternate endpoint, or automatic email retry that skips it.
Resend's sender, recipient configuration and notification implementation are unchanged.

## Cloudflare and deployment setup

1. In Cloudflare Dashboard → Turnstile, create a **Managed** widget. Cloudflare DNS
   hosting is not required. Configure the exact authorized application hostnames;
   do not enable unrestricted/any-hostname use or add localhost to the production widget.
2. Set these variables in the repository-root ignored `.env.local` for development,
   or the appropriate Vercel environment (Preview and Production configured separately):

   ```dotenv
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=<public widget site key>
   TURNSTILE_SECRET_KEY=<private matching widget secret>
   TURNSTILE_ALLOWED_HOSTNAMES=<exact hostname,another explicitly authorized hostname>
   ```

   Hostnames contain no scheme, path or port; e.g. `localhost` or
   `math-bac.example`. The server uses exact matches, not suffixes or wildcards.
   Configure stable preview hostnames in both Cloudflare and this allowlist.
   Do not put actual secrets in tracked files, browser code, screenshots or logs.
3. Set the public key **before building**: Next.js inlines `NEXT_PUBLIC_*` values.
   Rebuild/redeploy after changing it. The secret and hostname allowlist stay server-only.
   A missing/blank public key, secret or allowlist fails closed; a build can still
   succeed, but contact delivery will remain blocked until correctly configured.
4. Keep existing Resend variables and sending configuration unchanged; see
   [contact-delivery.md](contact-delivery.md). No live send is authorized by this task.
5. Permit outbound server HTTPS to `challenges.cloudflare.com` for Siteverify.
   If a CSP is introduced, permit the official Turnstile script and frames from
   `https://challenges.cloudflare.com`; do not proxy or self-host the script.

## Trust boundary and token lifecycle

- The client submits a token separately from the existing contact draft. It never
  submits a trusted verification boolean or receives the secret.
- The action independently validates fields, then calls the server-only verifier
  before Resend. Missing/non-string/blank/over-2048-character tokens are rejected.
- Siteverify is a non-cached POST to the fixed Cloudflare URL, with a 10-second
  timeout and no retries. Only literal `success: true` **and** an allowed verified
  hostname permit delivery. HTTP failures, malformed JSON/responses, transport
  errors, invalid, expired or duplicate tokens all return safe `verification_error`.
  No provider details, tokens, secrets or applicant data are logged or echoed.
- Cloudflare enforces token expiry (300 seconds) and single use. We do not cache
  successful verification or implement a local replay store. Successful verification
  is not proof of phone ownership or a substitute for future abuse controls.
- The focused widget uses explicit rendering, the official compact size (150×140px),
  Russian language, light theme and keyboard-accessible controls. Compact fits the
  narrow mobile card; Cloudflare's flexible size has a 300px minimum width. Script load errors/timeouts,
  challenge failures and expiry clear the token and offer “Повторить проверку”.
  Retrying replaces only the widget, never the draft and never calls the action.
  The native script lifecycle allows retrying a failed download without page reload.
- Every completed server attempt (including field/security/provider errors and
  thrown invocation failures) clears the token and replaces the widget. A consumed
  or uncertain token is never deliberately reused. Client-only field validation
  does not consume the token; expiry is still handled by the widget.
- The existing synchronous duplicate-submit lock, disabled pending fieldset,
  country synchronization and success/reset/focus behavior remain intact.
  Verification errors preserve fields and invite a fresh challenge. Delivery/network
  uncertainty retains its existing warning against blindly resending a possible email.

## Explicit local testing (never production)

For `npm run dev` only, set the official public testing key pair explicitly:

```dotenv
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
TURNSTILE_ALLOWED_HOSTNAMES=localhost
```

Cloudflare's dummy token is `XXXX.DUMMY.TOKEN.XXXX`. For failure tests use site key
`2x00000000000000000000AB` and secret `2x0000000000000000000000000000000AA`;
for spent-token verification use secret `3x0000000000000000000000000000000AA`.
These are published testing credentials, not project secrets. They still call
Siteverify; **no verification bypass exists**. The server refuses official dummy
key patterns whenever `NODE_ENV=production`, including `next build`/`next start`
and production-mode previews. Use genuine restricted widget keys for those builds.
There is no automatic development key selection or production override flag.

**Testing keys do not mock email delivery.** Use mocked action/provider responses
for UI/automated tests; alternatively remove delivery credentials in a dedicated
local process to guarantee no emails. Never exercise an accepted live action with
configured Resend credentials without separate authorization. Do not weaken
production environment mode to make test keys work in a deployed build.

The existing isolated Node test command in [contact-delivery.md](contact-delivery.md)
now covers missing/malformed tokens, missing security configuration, production
rejection of dummy keys, failed/expired/spent verification, response validation,
hostname checks, timeout/transport failures and verification-before-Resend ordering.
All external requests are mocked. Existing validation and notification tests remain.

### Manual/UI checks with mocked delivery only

- Fill synthetic fields. Without a solved challenge, submit makes no action call.
- Block/fail the script download; retry the widget without losing fields.
- Trigger success, expiry, interactive timeout and widget error callbacks; stale
  tokens must not allow submission. Retry must render a new challenge, not send.
- Solve; dispatch rapid duplicate submits while the mocked action is unresolved:
  exactly one call, controls disabled, draft unchanged.
- Return `verification_error`, `validation_error`, `delivery_error`, `server_error`,
  or reject the action promise: retain fields and mount a fresh widget; no auto send.
- Return `accepted`: original success screen/focus remains. Reset-only button
  restores empty fields/MD and Name focus; fresh widget, no action call.
- Inspect 360/390/1440px, keyboard navigation, status announcements and iframe
  challenge interaction. A mocked SDK cannot establish real challenge accessibility.

### Implementation verification

Targeted browser assertions used a stubbed Turnstile SDK and intercepted every
Server Action POST in an isolated temporary app copy with empty Resend credentials.
They covered missing/expired tokens, widget retry/load failure/error/timeout,
country synchronization, synchronous duplicate protection, fresh widgets after all
five failure paths, draft preservation, and accepted/reset focus behavior. These
were ad hoc checks, not a committed UI test suite. Compact widget bounds fitted
Contact at 360, 390 and 1440px using a size-matched mock; actual Cloudflare iframe
rendering and screen-reader behavior still need manual review. Existing unrelated
Hero/Team decorations extended beyond the page bounds at narrow widths in this
isolated check; no unrelated layout changes were made.

## Approved CLI smoke testing

The existing gated smoke script also requires `CONTACT_SMOKE_TURNSTILE_TOKEN` in
its private process environment. Supply a fresh matching widget token, or the
published dummy token **only with the explicit local testing configuration above**.
The script still verifies with Cloudflare and still refuses to run without
`--send-one-test-email`. Never print a real token. Tokens expire and are single-use;
never automatically rerun after an uncertain result. The existing compile/run
instructions otherwise remain unchanged. No smoke email was sent for this task.

## Official sources checked

- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/turnstile/troubleshooting/testing/

Rate limiting, persistent idempotency, privacy/legal approval and public-release
readiness remain separate tasks. Turnstile alone does not guarantee absence of spam.
