import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import {
  type ContactFormInput,
  validateContactForm,
} from "../../lib/validateContactForm";
import { type ContactSubmissionResult, submitContact } from "./submitContact";

const draft = { name: "Анна", country: "MD", phone: "069123456", comment: "" };

const siteverify = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const token = "XXXX.DUMMY.TOKEN.XXXX";

function mockDelivery(deliver: typeof fetch) {
  return mock.method(
    globalThis,
    "fetch",
    async (url: string | URL | Request, options?: RequestInit) => {
      if (url === siteverify)
        return Response.json({ success: true, hostname: "localhost" });
      return deliver(url, options);
    },
  );
}

let originalEnv: NodeJS.ProcessEnv;
beforeEach(() => {
  originalEnv = { ...process.env };
  process.env = { ...process.env, NODE_ENV: "test" };
  process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
  process.env.TURNSTILE_ALLOWED_HOSTNAMES = "localhost";
  process.env.RESEND_API_KEY = "unit-test-key";
  process.env.CONTACT_NOTIFICATION_EMAIL = "recipient@example.test";
  delete process.env.RESEND_DEBUG;
  delete process.env.RESEND_BASE_URL;
  mockDelivery(async () => {
    throw new Error("Unit tests must mock provider responses");
  });
});
afterEach(() => {
  process.env = originalEnv;
  mock.restoreAll();
});

test("validated input is normalized before delivery and provider acceptance is not echoed as data", async () => {
  const request = mockDelivery(
    async (_url: string | URL | Request, options?: RequestInit) => {
      assert.match(String(options?.body), /Телефон: \+/);
      return Response.json({ id: "mock-message-id" });
    },
  );
  for (const [country, phone] of [
    ["MD", "069123456"],
    ["RO", "0721234567"],
    ["DE", "030901820"],
    ["GB", "02079460018"],
    ["MD", "+442079460018"],
  ]) {
    const input = Object.freeze({ ...draft, country, phone });
    assert.deepEqual(await submitContact(input, token), {
      status: "accepted",
    });
    assert.equal(input.phone, phone);
  }
  assert.equal(request.mock.callCount(), 10);
});

test("external invalid fields are independently rejected without sending email", async () => {
  const request = mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected delivery");
  });
  const cases: ContactFormInput[] = [
    { name: "", country: "MD", phone: "", comment: "" },
    { ...draft, name: "Ion123" },
    { ...draft, name: "а".repeat(101) },
    { ...draft, comment: "а".repeat(1001) },
    { ...draft, country: "ZZ" },
    { ...draft, country: "US" },
    { ...draft, phone: "invalid" },
    { ...draft, phone: "+12133734253" },
    { ...draft, phone: "+80012345678" },
    { name: {}, country: 373, phone: null, comment: [] },
  ];
  for (const input of cases) {
    const validation = validateContactForm(input);
    assert.equal(validation.valid, false);
    if (!validation.valid) {
      assert.deepEqual(await submitContact(input), {
        status: "validation_error",
        errors: validation.errors,
      });
    }
  }
  assert.equal(request.mock.callCount(), 0);
});

test("provider rejection returns delivery_error without exposing provider details", async () => {
  const request = mockDelivery(async () =>
    Response.json(
      {
        statusCode: 403,
        name: "validation_error",
        message: "private provider detail",
      },
      { status: 403 },
    ),
  );
  assert.deepEqual(await submitContact(draft, token), {
    status: "delivery_error",
  });
  assert.equal(request.mock.callCount(), 2);
});

test("ambiguous provider responses and SDK transport errors pass through as uncertainty", async () => {
  for (const deliver of [
    async () => Response.json({}),
    async () =>
      Response.json(
        { statusCode: 429, name: "rate_limit_exceeded" },
        { status: 429 },
      ),
    async () => {
      throw new Error("private transport detail");
    },
  ]) {
    const request = mockDelivery(deliver);
    assert.deepEqual(await submitContact(draft, token), {
      status: "delivery_uncertain",
    });
    assert.equal(request.mock.callCount(), 2);
  }
});

test("missing delivery configuration returns delivery_error", async () => {
  delete process.env.RESEND_API_KEY;
  assert.deepEqual(await submitContact(draft, token), {
    status: "delivery_error",
  });
});

test("malformed envelopes bypassing TypeScript return field errors, not crashes", async () => {
  for (const payload of [
    undefined,
    null,
    false,
    123,
    "draft",
    [],
    {},
    { name: "Анна" },
  ]) {
    // Reflect simulates callers that bypass the compile-time action input contract.
    const result: ContactSubmissionResult = await Reflect.apply(
      submitContact,
      undefined,
      [payload],
    );
    assert.equal(result.status, "validation_error");
    if (result.status === "validation_error") {
      assert.ok(Object.keys(result.errors).length > 0);
    }
    assert.ok(!("data" in result));
  }
});

test("unexpected failures return no internal details", async () => {
  const input = {
    country: draft.country,
    phone: draft.phone,
    comment: draft.comment,
    get name(): string {
      throw new Error("private internal failure");
    },
  };
  assert.deepEqual(await submitContact(input), { status: "server_error" });
});

test("missing or malformed tokens prevent every external request", async () => {
  const request = mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected request");
  });
  for (const value of [undefined, null, "", "   ", 123, {}, "a".repeat(2049)]) {
    assert.deepEqual(await submitContact(draft, value), {
      status: "verification_error",
    });
  }
  assert.equal(request.mock.callCount(), 0);
});

test("missing security configuration fails closed before any request", async () => {
  const request = mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected request");
  });
  for (const key of [
    "TURNSTILE_SECRET_KEY",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    "TURNSTILE_ALLOWED_HOSTNAMES",
  ]) {
    const original = process.env[key];
    for (const value of [undefined, "   "]) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
      assert.deepEqual(await submitContact(draft, token), {
        status: "verification_error",
      });
    }
    process.env[key] = original;
  }
  assert.equal(request.mock.callCount(), 0);
});

test("production refuses official dummy keys, even with a valid-looking token", async () => {
  process.env = { ...process.env, NODE_ENV: "production" };
  const request = mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected request");
  });
  for (const [siteKey, secret] of [
    ["1x00000000000000000000AA", "real-secret"],
    ["real-site-key", "1x0000000000000000000000000000000AA"],
    ["2x00000000000000000000AB", "2x0000000000000000000000000000000AA"],
    ["3x00000000000000000000FF", "3x0000000000000000000000000000000AA"],
  ]) {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = siteKey;
    process.env.TURNSTILE_SECRET_KEY = secret;
    assert.deepEqual(await submitContact(draft, token), {
      status: "verification_error",
    });
  }
  assert.equal(request.mock.callCount(), 0);
});

test("production still requires and accepts successful Siteverify with non-dummy configuration", async () => {
  process.env = { ...process.env, NODE_ENV: "production" };
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "synthetic-production-site-key";
  process.env.TURNSTILE_SECRET_KEY = "synthetic-production-secret";
  const request = mockDelivery(async () => Response.json({ id: "mock-id" }));
  assert.deepEqual(await submitContact(draft, "synthetic-token"), {
    status: "accepted",
  });
  assert.equal(request.mock.callCount(), 2);
});

test("invalid, expired, duplicated, malformed and wrong-host verification never reaches Resend", async () => {
  for (const body of [
    { success: false, "error-codes": ["invalid-input-response"] },
    { success: false, "error-codes": ["timeout-or-duplicate"] },
    { success: "true", hostname: "localhost" },
    { success: true },
    { success: true, hostname: "attacker.example" },
    null,
    [],
    {},
  ]) {
    const request = mock.method(
      globalThis,
      "fetch",
      async (url: string | URL | Request) => {
        assert.equal(url, siteverify);
        return Response.json(body);
      },
    );
    const input = Object.freeze({ ...draft });
    assert.deepEqual(await submitContact(input, token), {
      status: "verification_error",
    });
    assert.deepEqual(input, draft);
    assert.equal(request.mock.callCount(), 1);
  }
});

test("Siteverify HTTP, JSON and transport failures are closed and never retried", async () => {
  for (const response of [
    async () =>
      Response.json({ success: true, hostname: "localhost" }, { status: 503 }),
    async () => new Response("not JSON"),
    async () => {
      throw new DOMException("private timeout detail", "TimeoutError");
    },
  ]) {
    const request = mock.method(
      globalThis,
      "fetch",
      async (url: string | URL | Request) => {
        assert.equal(url, siteverify);
        return response();
      },
    );
    assert.deepEqual(await submitContact(draft, token), {
      status: "verification_error",
    });
    assert.equal(request.mock.callCount(), 1);
  }
});

test("verification precedes delivery; a spent token cannot send a second notification", async () => {
  let verificationCount = 0;
  let sends = 0;
  process.env.TURNSTILE_ALLOWED_HOSTNAMES = "preview.example, localhost";
  mock.method(
    globalThis,
    "fetch",
    async (url: string | URL | Request, options?: RequestInit) => {
      if (url === siteverify) {
        assert.equal(options?.method, "POST");
        assert.equal(options?.cache, "no-store");
        assert.ok(options?.signal);
        assert.deepEqual(JSON.parse(String(options?.body)), {
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        });
        verificationCount++;
        return Response.json({
          success: verificationCount === 1,
          hostname: "localhost",
        });
      }
      assert.equal(url, "https://api.resend.com/emails");
      assert.equal(verificationCount, 1);
      sends++;
      return Response.json({ id: "mock-id" });
    },
  );
  assert.deepEqual(await submitContact(draft, token), { status: "accepted" });
  assert.deepEqual(await submitContact(draft, token), {
    status: "verification_error",
  });
  assert.equal(verificationCount, 2);
  assert.equal(sends, 1);
});
