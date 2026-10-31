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

test("provider errors and missing acknowledgments never return accepted", async () => {
  for (const [status, body] of [
    [403, { name: "validation_error", message: "private provider detail" }],
    [429, { name: "rate_limit_exceeded", message: "private provider detail" }],
    [200, {}],
  ] satisfies [number, object][]) {
    const request = mock.method(globalThis, "fetch", async () =>
      Response.json(body, { status }),
    );
    assert.deepEqual(await sendContactNotification(validatedContact()), {
      status: "delivery_error",
    });
    assert.equal(request.mock.callCount(), 1);
  }
});

test("transport failures are safe and not retried", async () => {
  const request = mock.method(globalThis, "fetch", async () => {
    throw new Error("private transport detail");
  });
  assert.deepEqual(await sendContactNotification(validatedContact()), {
    status: "delivery_error",
  });
  assert.equal(request.mock.callCount(), 1);
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
