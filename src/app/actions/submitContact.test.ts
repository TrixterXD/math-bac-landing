import assert from "node:assert/strict";
import { test } from "node:test";
import {
  type ContactFormInput,
  validateContactForm,
} from "../../lib/validateContactForm";
import { type ContactSubmissionResult, submitContact } from "./submitContact";

const draft = { name: "Анна", country: "MD", phone: "069123456", comment: "" };

test("valid input is validated but never reported as delivered or echoed", async () => {
  for (const [country, phone] of [
    ["MD", "069123456"],
    ["RO", "0721234567"],
    ["DE", "030901820"],
    ["GB", "02079460018"],
    ["MD", "+442079460018"],
  ]) {
    const input = Object.freeze({ ...draft, country, phone });
    assert.deepEqual(await submitContact(input), {
      status: "delivery_not_implemented",
    });
    assert.equal(input.phone, phone);
  }
});

test("external invalid fields are independently rejected using the shared rules", async () => {
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
