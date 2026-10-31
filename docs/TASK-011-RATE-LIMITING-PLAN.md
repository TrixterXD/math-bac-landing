# TASK-011A — Contact rate limiting architecture plan

**Status:** proposal, not implementation approval. Investigated on `main` at `b3c879b` (PR #8 merged). Only this document is added. No dependencies installed, resources created, application changes, or live submissions.

## 1. Recommendation and decisions needed first

Use **one shared Upstash Redis database and the single-region `Ratelimit` class from `@upstash/ratelimit`**, with two independent, atomic limits inside the existing Server Action. Also requires `@upstash/redis`, neither currently installed. Keep Turnstile and server validation; rate limiting supplements them.

For the smallest maintainable implementation, recommend:

| Gate | Proposed policy | What it counts |
| --- | --- | --- |
| Request | 10 per fixed one-minute window per IP | Every invocation that reaches the action with a trustworthy IP, including invalid fields/tokens |
| Delivery | 3 per fixed 15-minute window per IP | Verified requests admitted to an email attempt, including failures and uncertain outcomes |

**These are proposed policy adjustments, not an exact implementation of “3 accepted submissions per 15 minutes.” Approval is required.** A fixed window is a clock-aligned bucket, not “the last N minutes.” It can admit 10 requests just before a minute boundary and 10 just after; delivery can similarly admit 3+3 around a boundary. Provider acceptance can happen in a different window from admission. Do not describe this as a strict rolling cap on accepted emails.

Why recommend this version: fixed counters are cheap, understandable, automatically expire, and require no refund/finalization protocol. Three *attempted sends* is conservative compared with three successful sends: failures cannot be used to repeatedly call the provider without consuming quota. It may temporarily block legitimate users after provider failures.

If the product requires strict “any trailing 15 minutes” or successful-acceptance-only accounting, do not silently substitute this policy. See section 5; reopen scope before implementation. Upstash's built-in sliding window is an **approximation**, not an exact sliding event log. Do not invent a bespoke Lua quota engine for this small form unless that precision is genuinely required.

“Production-ready” here means a reviewed abuse guard with explicit outage behavior, trusted deployment inputs, tests and monitoring—not a mathematically hard global billing cap, an exactly-once email system, or a public-launch approval.

## 2. Current architecture

### Actual path

1. `src/components/ContactSection/ContactForm.tsx` validates the local draft and requires a token before invoking `submitContact`. It synchronously locks duplicate clicks and disables fields while pending.
2. `src/app/actions/submitContact.ts` is a public Server Action. It safely handles malformed envelopes, invokes shared validation, calls Siteverify, then calls notification delivery. Unexpected failures return `server_error`.
3. `src/lib/validateContactForm.ts` checks runtime field types, name syntax/length, approved country, phone validity/normalization and comment length. Phone is normalized to E.164. Client checks do not replace this boundary.
4. `src/lib/verifyTurnstile.ts` rejects missing configuration and malformed tokens, rejects official dummy keys in production, POSTs to Cloudflare with a 10-second timeout and no retry, and requires literal success plus an allowed hostname. Errors fail closed. Tokens expire after five minutes and are single-use at Cloudflare.
5. `src/lib/sendContactNotification.ts` uses Resend, a configured recipient and fixed sender. A provider message ID without an error returns `accepted`; other outcomes return `delivery_error`. The provider call has a 15-second timeout, no automatic application retry, and intentionally does not distinguish rejection from uncertain transport outcomes. Acceptance is not inbox delivery.
6. After every completed action attempt the form clears the token and refreshes only the widget. Errors retain the draft; confirmed acceptance clears it. `verificationRequested` resets on token success, completion, retry and starting another request.

There is no shared rate-limit state, database, trusted-IP helper, or persistent idempotency store. A client-side lock protects UX, not malicious or concurrent HTTP callers. No IP is currently sent to Siteverify; this plan does not require changing that.

### Existing tests and deployment evidence

- `submitContact.test.ts` covers malformed input, server validation, missing/security configuration, token failure/expiry/duplication, allowed hostnames, verification-before-email, safe failures and no automatic retries.
- `sendContactNotification.test.ts` covers fixed recipient, normalization-derived content, acknowledgments, provider rejection, transport failures and missing configuration using mocked fetch.
- `validateContactForm.test.ts` covers runtime types, limits, Unicode names, country/phone behavior and normalization.
- `scripts/turnstile.test.cjs` and `scripts/contact-feedback.test.cjs` exercise component handlers with mocked hooks/actions, not a browser renderer.
- Repository documentation targets **Vercel Preview and Production**. No hosting account, domain routing, function region, proxy setup or paid plan was inspected. Direct-to-Vercel deployment is a proposed assumption, not a verified infrastructure fact.

Next.js documents Server Actions as externally reachable POST endpoints. Action IDs, Origin/Host checks and client UI guards are not a rate limiter. Keep the normal Next.js request/body protections; calls rejected by the platform before the action cannot be counted by an action-level gate.

## 3. Trustworthy client IP

### Supported initial topology: browser → Vercel → Next.js action

Read request headers **inside the action** using `await headers()` from `next/headers`. Do not read them during static page rendering or accept an IP as an action argument.

Vercel's request-header documentation says `x-forwarded-for` contains the client's public IP and that Vercel overwrites incoming values to prevent spoofing. It also documents `x-vercel-forwarded-for`; `x-real-ip` is an alias of `x-forwarded-for`. For the initial direct-to-Vercel topology, use **only the documented, Vercel-overwritten `x-forwarded-for` value**, not a fallback chain.

The trust comes from Vercel's ingress contract, **not the name of the header**. Application code cannot discover a trusted proxy merely by seeing a header or a `VERCEL` variable. Configure the platform marker server-side and verify the actual deployed route. Do not add an alternate public origin that bypasses the trusted ingress.

The helper should:

- Require the approved hosting context in deployed Preview/Production. A local/self-hosted process does not inherit Vercel's guarantees.
- Accept one valid IPv4 or IPv6 address only, with bounded length. Reject missing values, commas/lists, hostnames, ports, zone identifiers and malformed input. Do not pick the first/last element of an arbitrary forwarding chain.
- Validate with Node's `net.isIP` and canonicalize using a tested platform-based representation before deriving the key. Normalize equivalent IPv6 spellings and IPv4-mapped IPv6 to the same intended identity; do not create an unreviewed handwritten IP parser. Node runtime is sufficient; no Edge migration is needed.
- Never fall back to `Forwarded`, `CF-Connecting-IP`, user input, a random identifier, or a shared `unknown` bucket. Missing/untrusted IP means unavailable and **no email**.

If another proxy/CDN sits before Vercel, Vercel may see the proxy IP and group all visitors together. Do not recover the original IP by trusting external headers. Vercel documents an Enterprise Trusted Proxy option; that requires a separate deployment/security decision. Revisit the helper whenever topology changes.

**Release test:** on an authorized preview, send synthetic requests with forged forwarding headers and confirm the server-derived identity cannot be changed. Test IPv4, IPv6, direct deployment URLs and custom domains. Prefer an automated equality assertion or private short-lived diagnostics; never expose an IP-echo endpoint or log raw IPs permanently. Do not invoke the live email path for this test.

For local unit tests, mock `headers()` and the server-owned hosting context. For interactive local development, use a dedicated process with explicitly simulated Vercel headers and mocked delivery, or a separately approved development-only harness. Do not ship a production IP bypass or default localhost identity. Without a trustworthy source, the action is intentionally unavailable.

## 4. Exact proposed request flow

All gates are awaited sequentially inside the action's existing safe error boundary:

1. **Obtain and validate trusted IP; derive identifier.** Missing IP/configuration returns `submission_unavailable`. No downstream requests.
2. **Consume request quota:** atomic `requestLimiter.limit(identifier)`, configured as `fixedWindow(10, "1 m")`. Invalid form fields and invalid/missing tokens still spend request quota. A denial stops here before validation, Siteverify or Resend.
3. **Validate input:** retain existing runtime envelope handling and validation rules. Invalid input returns existing field errors. Do not move security checks to the browser.
4. **Verify Turnstile:** retain existing Siteverify behavior. Invalid token or verification outage returns existing `verification_error`; no delivery quota consumed.
5. **Reserve delivery quota:** atomic `deliveryLimiter.limit(identifier)`, configured as `fixedWindow(3, "15 m")`. Only an explicit, healthy allow result permits moving on. Denial/unavailability stops before Resend.
6. **Attempt delivery once:** existing `sendContactNotification(result.data)`. Leave the reservation consumed regardless of accepted, rejected, timed-out or unknown outcome. Do not decrement it, retry automatically, or reset the whole user's counter.
7. **Return the structured outcome.** Preserve form behavior: refresh token after action completion, retain draft on every failure, clear it only on `accepted`. Never auto-submit when a countdown ends.

The request gate deliberately precedes input validation so malformed submissions cannot avoid it. The platform must still handle oversized or undecodable bodies before action execution. The delivery gate deliberately follows Siteverify so unsolved challenges cannot exhaust delivery slots. Consequently, an otherwise valid token can be consumed before delivery is denied: the existing widget refresh handles this. A third “peek” before Siteverify would cost another read and is not authoritative under concurrency, so omit it initially.

A request-limit Redis failure must not be mapped to a field or Turnstile error. A delivery-limit Redis failure after Siteverify consumes the token but still sends nothing. No background task may later send the email after the action has returned unavailable.

## 5. Attempts, reservations and successful acceptances

- **Attempt counter:** “This IP called the action.” It is consumed before knowing whether the caller supplied useful data or a valid token.
- **Reservation/admission counter:** “This request has permission to try sending.” It must be acquired atomically **before** contacting Resend. Other simultaneous requests see that capacity as spent.
- **Acceptance counter:** “Resend acknowledged a message ID.” Updating this only after sending is useful for aggregate metrics, but unsafe as a gate by itself.

Example: with zero accepted emails, ten concurrent requests each read `accepted = 0`. All ten send, then update the counter. The final counter can be correct while the three-email policy has already been violated. A Redis transaction only around the final increment does not fix the earlier admission race.

If accepted-only accounting is mandatory, a complete design needs atomic pending reservations, unique reservation IDs, state transitions to accepted, safe release only for proven pre-send/rejection cases, expiry/lease handling and recovery after crashes. An HTTP timeout may mean Resend accepted the email; refunding permits extra sends. Expiring a pending reservation can have the same problem. The current delivery result deliberately combines all these failures, so it cannot safely drive refunds. Do not introduce negative-rate refunds or `resetUsedTokens` as a shortcut.

Even with pending reservations, Redis and Resend do not share a transaction: a crash after sending but before recording acceptance leaves uncertainty. Exactly-once delivery requires a broader idempotency/reconciliation design, not just a counter. That is out of scope for the first rate limiter.

## 6. Concurrency, consistency and backend configuration

### Safe normal-operation admission

Use the SDK's atomic Lua-backed `limit()` operation, not `GET → if below limit → INCR`. The inspected upstream fixed-window script increments and assigns expiration within one script. With two slots used and two simultaneous callers for the third, the shared counter admits only one in normal operation. Multiple serverless instances use the same database and prefix; module-global JS counters cannot do this.

The request and delivery checks need not be one transaction. A request may spend request quota and later fail validation/verification/delivery admission. Wasting capacity is safe; skipping a gate is not. Do not hold a Redis lock while waiting for Cloudflare or Resend.

### SDK behavior that must be overridden or guarded

- SDK **defaults to fail-open after five seconds**. Timeout responses have `success: true` and `reason: "timeout"`. Configure a short bounded timeout (proposed **2 seconds per check**) and explicitly translate **any timeout reason to unavailable**, regardless of `success`. Catch rejected Redis promises and malformed/unexpected responses as unavailable too. Only an allow result from the supported path may proceed.
- Configure `analytics: false`, `ephemeralCache: false`, and no dynamic limits/deny-list features initially. Disabling the default blocked-identifier cache makes tests and state simpler and keeps IP-derived identifiers out of a process-local map. A deny-only cache could be added later for cost protection; it must never cache permissions to send.
- Use one shared backend and the **single-region limiter**, not `MultiRegionRatelimit`, which asynchronously synchronizes separate database state. Put the function and database near each other to reduce latency; no user-specific regional routing into separate quotas.
- A timeout is **not proof no Redis write happened**. Do not retry an uncertain quota operation to recover capacity. It may have consumed a slot; return unavailable. Any lower-level SDK transport retries must be inspected and bounded when selecting package versions: an uncertain duplicate increment may overcount (conservative) but must not create an extra email attempt.
- Initialize reusable clients/limiters outside the handler or lazily in the server-only module, but ensure absent configuration becomes a safe action result, not an uncaught module-import/build failure. Keep the policy constants in code, not user-editable settings.

### Important consistency limitation

Upstash's official consistency documentation describes leader-based writes, asynchronous replication, eventual consistency and possible last-writer-wins conflict resolution during partitions. It states the old strong-consistency mode was deprecated. Atomic Lua admission fixes ordinary application races; it does **not establish a globally linearizable guarantee through partitions/failovers**. A client cannot reliably detect a healthy-looking but rolled-back counter after backend data loss. Fail-closed error handling covers detected unavailability, not undetected state loss.

Use this as proportional spam protection, not a contractual financial ceiling. Confirm the selected database topology, persistence, capacity/eviction behavior and current service guarantees before launch; quota-key eviction or data reset can reopen capacity. If the developer requires a strict hard bound even through failover, this recommendation is insufficient: choose a backend with verified stronger transactional guarantees and revisit the architecture. No such guarantee was established in this investigation.

## 7. Failure scenarios and user-facing responses

Propose extending `ContactSubmissionResult` with:

```ts
| { status: "rate_limited"; retryAfterSeconds: number }
| { status: "submission_unavailable" }
```

Do not return IPs, Redis keys, secrets, provider errors or quota internals. One rate-limited status is enough for either gate; internal metrics may distinguish them. Return `Math.max(1, Math.ceil((reset - now) / 1000))` for a valid fixed-window denial; validate metadata and bound the value to the configured gate window. Unusable metadata is unavailable, not permission. Retry timing is advisory, not a promise of acceptance after waiting.

| Situation | Outcome and side effects |
| --- | --- |
| Request limit exceeded | `rate_limited`; no validation-dependent network calls, Siteverify or email |
| Missing/invalid/untrusted IP or HMAC/Redis config | `submission_unavailable`; no email, no anonymous fallback |
| Redis exception, auth/quota error, timeout, malformed result | `submission_unavailable`; never treat timeout's `success: true` as admission |
| Invalid fields | Existing `validation_error`; request quota spent, delivery quota untouched |
| Missing/invalid/expired/spent token or Siteverify outage | Existing `verification_error`; request quota spent, delivery quota untouched |
| Delivery capacity exhausted | `rate_limited`; token may already be consumed; no email |
| Resend rejection or missing acknowledgement | Existing `delivery_error`; reservation retained, draft preserved |
| Resend timeout/disconnect, or process dies after admission | Reservation retained until window expiry; do not claim definite non-delivery or refund/retry |
| Provider acknowledges an ID | Existing `accepted`; reservation remains; do not imply inbox delivery |
| Response lost after provider acceptance | Browser retains uncertainty warning; a fresh token can still create a duplicate within quota. Rate limiting is not idempotency |

Suggested copy: “Слишком много попыток. Подождите немного и повторите отправку. Данные сохранены.” For unavailable: “Отправка временно недоступна. Попробуйте позже. Данные сохранены.” These pre-send statuses may state no send was attempted; existing delivery/network ambiguity copy must remain unchanged.

A Server Action returns a serialized result, not a normal JSON Route Handler response. Do not promise an HTTP 429 or `Retry-After` header from this action. Handle the structured result in the existing UI switch. Do not add a route solely to customize status codes.

## 8. Privacy and retention

- IP addresses are personal/pseudonymous data, not an identity or proof of ownership. Shared home/school/mobile NAT can make unrelated people share quota. VPNs, changing IPs and IPv6 address rotation can evade it. Full IPv6 addresses are the least surprising initial policy; `/64` grouping reduces rotation bypass but can block unrelated users and needs separate approval.
- Prefer `HMAC-SHA-256(serverSecret, canonicalIp)` as the Redis identifier, using Node `crypto`. Plain SHA-256 of an IPv4 address is easily enumerable. HMAC limits offline enumeration if Redis keys leak; it does **not anonymize** IP data or protect against compromise of both the secret and store.
- Use a stable high-entropy, server-only secret across active deployments. Avoid daily salt/key rotation: changing identities during a live window reopens quota. Planned rotation resets quotas unless old/new identities are checked during migration; document and schedule it rather than building rotation machinery now.
- Prefix keys by app, environment, policy version and gate, e.g. `math-bac:production:contact:v1:request` / `...:delivery`. Production deployments share a stable namespace; no deployment ID in production keys. Preview and local tests never share production keys or credentials.
- Store only HMAC identifiers and counters/TTL, not names, phone numbers, comments or Turnstile tokens. Keep raw IP transient in server memory; never log it or attach it to notification email/analytics. Upstash still sees the application's outbound connection metadata.
- Use SDK automatic key expiry; inspect and test the selected version's TTL. Do not promise immediate deletion at the nominal window boundary: the inspected fixed-window script sets TTL to the full window duration on the first increment, which can outlive that clock-aligned bucket. Require a documented maximum counter TTL (proposed under one hour for these policies), including blocked requests, and test that keys cannot be kept alive indefinitely. Revisit if SDK behavior differs.
- Disable limiter analytics. Configure minimal platform/application log retention, safe aggregate outcome counters and privacy-safe alerts; database backup/log retention and region/data-processing terms must be reviewed separately. Live-key TTL does not erase backups or platform access logs. HMAC is not a substitute for privacy/legal approval.

## 9. Simpler alternatives and cost

| Option | Cost / reliability / maintenance | Fit |
| --- | --- | --- |
| **Vercel WAF dashboard rate rule** | Fewer application changes and no Redis SDK/secrets. Runs before the function, helping with load/cost. Current docs list fixed-window rules on all plans (Hobby one rate rule); metered regional pricing and plan details must be checked. Counters are regional, not globally strict. Platform returns the denial, not our action result. | Good simpler request-flood protection, but cannot count provider acceptance or reserve only after Siteverify. Server Actions POST to a page route; matching that route/method may also affect other actions. Not a complete replacement for both requested gates. |
| **Upstash + SDK (recommended conditionally)** | One managed service, two server-only packages, HTTPS Redis requests and explicit fail-closed handling. Shared state across function instances. Adds latency and a dependency whose outage intentionally disables the form. Built-in atomic counters avoid handwritten quota scripts. | Best small application-level design for both gates and friendly structured outcomes, provided the policy/consistency tradeoffs above are accepted. |
| **In-memory Map or local file** | No vendor bill; looks simplest. Separate serverless instances/restarts each have their own quota; local files are not a shared durable store. Cleanup and races become application work. | Not production-suitable on Vercel. Do not use as outage fallback. |

Current Upstash pricing page lists free **250 MB / 500K commands per month**, pay-as-you-go **$0.20 per 100K commands**, with additional storage/bandwidth/plan terms. Paid allowances are not simply “free tier plus overage.” These are observed public prices, not an account quote or promise; recheck at provisioning.

Budget **Redis commands, not just form submissions**. The SDK costs page lists fixed-window calls as roughly 2 commands, or 3 on the first call for an identifier/window. A fully admitted submission checks two gates (roughly 4–6 commands); an invalid submission usually checks only the request gate. Retries, plan topology and enabled features affect cost. At 10,000 fully admitted submissions, 40K–60K limiter commands is an illustration, not a traffic forecast. No analytics or multi-region synchronization initially. Per-IP limits do not bound total bill or spam from many IPs: set provider budgets/alerts and consider a separate WAF rule if attacked. A database budget/quota exhaustion should fail closed; inspect actual vendor budget behavior rather than assuming it is a kill switch.

## 10. Small proposed module/file changes (later task only)

| File | Responsibility |
| --- | --- |
| `src/lib/getContactRateLimitKey.ts` + test | `server-only`; read trusted hosting headers, validate/canonicalize IP, HMAC it; return identifier or unavailable. No general proxy framework. |
| `src/lib/contactRateLimit.ts` + test | `server-only`; one Redis client, two named limiter instances, hard-coded approved limits/prefixes, bounded timeout and fail-closed result mapping. Export request-check and delivery-reservation functions. No service class, custom Lua or refunds. |
| `src/app/actions/submitContact.ts` + existing test | Add the two awaited gates and safe result variants; keep orchestration explicit. No validation-rule or delivery-adapter change. |
| `src/components/ContactSection/ContactForm.tsx` | Handle the two result variants, preserving draft, widget refresh, pending state and uncertainty copy. No unrelated visual changes/countdown feature. |
| `scripts/contact-feedback.test.cjs` | Add new action outcomes to existing mock coverage. |
| `package.json`, lockfile | Only after approval: install/pin compatible `@upstash/redis` and `@upstash/ratelimit`; inspect selected versions' scripts, timeout and retry behavior. |
| `docs/contact-security.md`, `docs/contact-delivery.md`, `README.md` as needed | Document setup, gate order, policy semantics, privacy, tests and operational recovery. No broad documentation rewrite. |

Proposed **new server-only** environment variables:

- `UPSTASH_REDIS_REST_URL` — approved Redis REST endpoint.
- `UPSTASH_REDIS_REST_TOKEN` — server credential permitted to run limiter operations; never a read-only token or `NEXT_PUBLIC_*` value.
- `CONTACT_RATE_LIMIT_HMAC_SECRET` — random high-entropy secret (at least 32 random bytes), stored privately.

Use Vercel's server-owned environment indicators to select the fixed preview/production namespace; no client-selected prefix. If those indicators are missing/unsupported, fail unavailable rather than guessing production. Keep all existing Turnstile/Resend variable names and values unchanged. Preview should have separate backend credentials/resources where feasible; a distinct namespace is a minimum, not credential isolation. Do not create any resources until authorized.

## 11. Implementation stages and acceptance gates

1. **Approve semantics and deployment:** decide fixed versus rolling windows, reservation counting versus accepted-only, topology/IP trust, NAT tradeoffs and tolerated consistency risk. Confirm Vercel plan, region, budget and privacy owner.
2. **Provision/configure manually with authorization:** choose Upstash region/topology, inspect persistence/eviction/service guarantees, create isolated environments and set private variables. No credentials committed. Pick/pin SDK versions and recheck the critical source behavior.
3. **Implement the two small helpers and mocked tests:** no action/network/email integration yet. Test fail-closed timeouts explicitly.
4. **Integrate action + structured UI outcomes:** update callers and existing fixtures/tests because invalid inputs now hit the request gate first. Preserve notification and Siteverify behavior. Handle missing config safely at runtime.
5. **Run static/build and mocked integration checks:** lint, typecheck, build, all existing tests plus new tests. Build success is not proof runtime credentials/IP trust work.
6. **Authorized isolated backend/preview acceptance:** concurrency and TTL tests against non-production Redis; IP spoofing/topology test on Vercel; all email transport mocked or disabled in an isolated test deployment. No live email authorized by this plan. Review diff and operations runbook before merge/deployment approval.

Operational runbook: alert on aggregate unavailable/denied counts, monitor vendor usage and latency, preserve fail-closed behavior during incidents, fix credentials/service then wait for TTL if necessary. Do not clear counters to “fix” customer retries, silently disable gates, or fall back to per-process state. Record deliberate policy/namespace/secret changes because they reset effective quotas.

## 12. Test strategy

### Mocked unit/action tests — repeatable, no real email/Cloudflare/Redis

- IP trust: missing platform context/header, forged fallback headers ignored, malformed/multiple/oversized addresses rejected, IPv4/IPv6 accepted, equivalent representations produce equal keys, distinct IPs differ, HMAC secret required; no raw IP in results/logs.
- Limiter wrapper: first allow and denial, reset/retry metadata, missing configuration, auth/network errors, exception, timeout **with `success: true`**, malformed results, unknown reasons and no bypass path. Simulate a late Redis result after timeout and assert email remains uncalled.
- Order assertions: trusted IP → request gate → validation → Siteverify → delivery reservation → Resend. Every failure stops later steps. Invalid inputs spend request quota but not delivery quota; failed token never spends delivery quota.
- Success and all existing server/provider/unknown outcomes preserve the same result semantics; delivery quota never refunded. Request and delivery limits use independent prefixes and environment isolation. Provider never called without both gates allowing and Siteverify succeeding.
- UI: rate-limited/unavailable results preserve draft and errors as appropriate, refresh token and clear stale verification feedback, release pending lock, offer deliberate retry, never auto-send. Existing challenge/loading/expiry messages stay intact.
- Update existing tests' blanket “no external requests on invalid input” expectations: a mocked limiter request may now happen, but never Siteverify or email. Explicitly mock trusted headers and limiter responses so tests cannot hit a real account.

### Backend integration — separate approval, isolated Redis only

- With one fixed bucket and no boundary crossing, 20 concurrent request admissions for the same identifier allow exactly 10 in ordinary healthy operation; parallel calls from multiple clients/function instances exercise shared state.
- With 2 consumed delivery slots, simultaneous contenders permit only 1 more; 20 fresh delivery reservations allow 3. Use distinct synthetic verified-token mocks when integrating with action tests so Cloudflare replay rejection does not mask a broken limiter.
- Test bucket boundaries deliberately (10+10 / 3+3 is expected under the proposed policy), independent identifiers, TTL expiration/buffer, denied-call TTL behavior and fresh windows. Do not mistake SDK's approximate sliding mode for strict rolling enforcement.
- Simulate disconnects and Redis response loss, provider acceptance followed by response loss, crash after reservation and retries with a fresh token. Verify no refunds, fallback sends or automatic retries.
- Verify no quota keys are configured for early eviction and record actual retention. These tests exercise ordinary operation, not a proof of the vendor's partition/failover guarantees.

## 13. Open decisions requiring developer approval

1. Accept **fixed-window** limits and conservative **send-admission counting**, or require exact rolling/accepted-only behavior? The proposed values 10/min and 3/15 min are reasonable starting points for a small form, but need real usage review, especially shared IPs.
2. Confirm direct-to-Vercel ingress, no additional proxy, Node function region, all public entry domains and trustworthy header behavior. What is the supported local development workflow without production bypasses?
3. Accept Upstash's documented consistency limitations for abuse protection, or require a stronger backend for a hard cap? Confirm chosen topology, TTL and eviction guarantees with current service details.
4. Approve Upstash, two dependencies, costs, resource creation, separate Preview/Production credentials and operational ownership. No installation or provisioning has happened.
5. Approve 2-second per-gate timeout, fail-closed service interruption UX and the two result variants/copy. Existing Turnstile and email timeouts remain unchanged.
6. Approve full-IP HMAC identity, stable secret, namespace policy, retention budget, data-processing region and privacy/legal review. IPv6 prefix grouping is not included.
7. Decide whether a platform WAF request rule is warranted now or only when monitoring shows abuse; it cannot replace application delivery admission. Distributed-IP attacks and duplicate delivery within quota remain risks.
8. Persistent email idempotency/reconciliation, global volume caps and alternate-contact UX remain separate tasks, not implicit scope of rate limiting.

## 14. Official sources and investigation limits

Consulted the following official documentation and upstream SDK source. URLs and pricing are snapshots of the research, not permanent guarantees; recheck at implementation/provisioning.

- Next.js [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers) and [data security / public Server Actions](https://nextjs.org/docs/app/guides/data-security); also inspected the matching installed Next.js 16.4.3 guides under `node_modules/next/dist/docs/`.
- Vercel [request headers / forwarding and spoofing contract](https://vercel.com/docs/headers/request-headers).
- Vercel [WAF rate limiting / regional counters, plan limits and pricing links](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).
- Upstash [algorithms / fixed boundaries and approximate sliding window](https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms).
- Upstash [features / default fail-open timeout, cache, analytics, multi-region sync](https://upstash.com/docs/redis/sdks/ratelimit-ts/features).
- Upstash [methods / `limit`, reason, reset, pending and reset API](https://upstash.com/docs/redis/sdks/ratelimit-ts/methods).
- Upstash [command costs](https://upstash.com/docs/redis/sdks/ratelimit-ts/costs), [current public pricing](https://upstash.com/pricing/redis), and [consistency guarantees/limitations](https://upstash.com/docs/redis/features/consistency).
- Official SDK source: [single-region limiter](https://github.com/upstash/ratelimit-js/blob/main/src/single.ts), [fixed-window Lua](https://github.com/upstash/ratelimit-js/blob/main/src/lua-scripts/single.ts), [timeout handling](https://github.com/upstash/ratelimit-js/blob/main/src/ratelimit.ts). These are moving `main` references, not an installed/pinned dependency contract.

Research used public documentation via HTTPS and local source inspection. No browser/deployment/account test, concurrency experiment, Redis failover experiment, or live email verification was performed. No application tests/build were run for this documentation-only task; the test strategy above is proposed coverage, not a claim of passing implementation tests.
