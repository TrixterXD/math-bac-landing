import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { sendContactNotification } from "./sendContactNotification";
import { validateContactForm } from "./validateContactForm";

let originalEnv: NodeJS.ProcessEnv;
beforeEach(() => {
  originalEnv = { ...process.env };
  process.env.RESEND_API_KEY = "unit-test-key";
  process.env.CONTACT_NOTIFICATION_EMAIL = "recipient@example.test";
  delete process.env.RESEND_DEBUG;
  delete process.env.RESEND_BASE_URL;
  mock.method(globalThis, "fetch", async () => {
    throw new Error("Unit tests must mock provider responses");
  });
});
afterEach(() => {
  process.env = originalEnv;
  mock.restoreAll();
});

function validatedContact(comment = "") {
  const result = validateContactForm({
    name: "  Анна  ",
    country: "MD",
    phone: "069123456",
    comment,
  });
  if (!result.valid) throw new Error("Invalid test fixture");
  return result.data;
}

test("provider acknowledgment sends one plain-text notification only to the configured recipient", async () => {
  const request = mock.method(
    globalThis,
    "fetch",
    async (url: string | URL | Request, options?: RequestInit) => {
      assert.equal(url, "https://api.resend.com/emails");
      assert.equal(options?.method, "POST");
      assert.deepEqual(JSON.parse(String(options?.body)), {
        from: "onboarding@resend.dev",
        to: ["recipient@example.test"],
        subject: "Math BAC — заявка из учебного прототипа",
        text: "Заявка на связь — учебный прототип Math BAC\n\nИмя: Анна\nТелефон: +37369123456\nВыбранная страна: Молдова (MD)\n\nКомментарий:\n<b>Тест</b>",
      });
      return Response.json({ id: "mock-message-id" });
    },
  );
  assert.deepEqual(
    await sendContactNotification(validatedContact("<b>Тест</b>")),
    { status: "accepted" },
  );
  assert.equal(request.mock.callCount(), 1);
});

test("empty optional comment is omitted", async () => {
  const request = mock.method(
    globalThis,
    "fetch",
    async (_url: string | URL | Request, options?: RequestInit) => {
      assert.ok(!String(options?.body).includes("Комментарий"));
      return Response.json({ id: "mock-message-id" });
    },
  );
  assert.deepEqual(await sendContactNotification(validatedContact()), {
    status: "accepted",
  });
  assert.equal(request.mock.callCount(), 1);
});

test("explicit API validation and authorization rejections confirm non-delivery", async () => {
  for (const [status, name] of [
    [400, "validation_error"],
    [401, "invalid_api_key"],
    [403, "validation_error"],
    [403, "restricted_api_key"],
    [422, "invalid_from_address"],
  ] satisfies [number, string][]) {
    const request = mock.method(globalThis, "fetch", async () =>
      Response.json(
        { statusCode: status, name, message: "private provider detail" },
        { status },
      ),
    );
    assert.deepEqual(await sendContactNotification(validatedContact()), {
      status: "delivery_error",
    });
    assert.equal(request.mock.callCount(), 1);
  }
});

test("ambiguous SDK errors and missing acknowledgments remain uncertain", async () => {
  for (const [status, body] of [
    [403, { name: "validation_error", message: "missing status code" }],
    [403, { statusCode: 403, name: "application_error" }],
    [408, { statusCode: 408, name: "validation_error" }],
    [409, { statusCode: 409, name: "concurrent_idempotent_requests" }],
    [429, { statusCode: 429, name: "rate_limit_exceeded" }],
    [500, { statusCode: 500, name: "validation_error" }],
    [200, {}],
    [200, { id: "" }],
    [200, { id: "  " }],
    [200, { id: 123 }],
  ] satisfies [number, object][]) {
    const request = mock.method(globalThis, "fetch", async () =>
      Response.json(body, { status }),
    );
    assert.deepEqual(await sendContactNotification(validatedContact()), {
      status: "delivery_uncertain",
    });
    assert.equal(request.mock.callCount(), 1);
  }
});

test("SDK-converted network and abort errors remain uncertain and are not retried", async () => {
  for (const error of [
    new Error("private transport detail"),
    new DOMException("Mock timeout", "TimeoutError"),
    new DOMException("Mock abort", "AbortError"),
  ]) {
    const request = mock.method(globalThis, "fetch", async () => {
      throw error;
    });
    assert.deepEqual(await sendContactNotification(validatedContact()), {
      status: "delivery_uncertain",
    });
    assert.equal(request.mock.callCount(), 1);
  }
});

test("malformed provider responses remain uncertain", async () => {
  for (const status of [200, 403, 500]) {
    const request = mock.method(
      globalThis,
      "fetch",
      async () => new Response("not JSON", { status }),
    );
    assert.deepEqual(await sendContactNotification(validatedContact()), {
      status: "delivery_uncertain",
    });
    assert.equal(request.mock.callCount(), 1);
  }
});

test("missing or blank required configuration prevents all requests", async () => {
  for (const key of ["RESEND_API_KEY", "CONTACT_NOTIFICATION_EMAIL"]) {
    const original = process.env[key];
    for (const value of [undefined, "   "]) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
      const request = mock.method(globalThis, "fetch", async () => {
        throw new Error("Unexpected request");
      });
      assert.deepEqual(await sendContactNotification(validatedContact()), {
        status: "delivery_error",
      });
      assert.equal(request.mock.callCount(), 0);
    }
    process.env[key] = original;
  }
});

test("SDK debug logging must be off before sending", async () => {
  process.env.RESEND_DEBUG = "true";
  const request = mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected request");
  });
  assert.deepEqual(await sendContactNotification(validatedContact()), {
    status: "delivery_error",
  });
  assert.equal(request.mock.callCount(), 0);
});
