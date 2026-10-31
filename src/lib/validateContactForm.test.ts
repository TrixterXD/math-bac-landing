import assert from "node:assert/strict";
import { test } from "node:test";
import { getCountryCallingCode, isSupportedCountry } from "libphonenumber-js";
import { countries } from "../components/ContactSection/countries.data";
import {
  type ContactFormInput,
  validateContactForm,
} from "./validateContactForm";

const draft = {
  name: "  Анна  ",
  country: "MD",
  phone: "069123456",
  comment: "",
};

test("all 50 approved countries are supported and use library calling codes", () => {
  assert.equal(countries.length, 50);
  assert.equal(new Set(countries.map((item) => item.code)).size, 50);
  for (const country of countries) {
    assert.ok(isSupportedCountry(country.code));
    assert.equal(
      country.callingCode,
      `+${getCountryCallingCode(country.code)}`,
    );
  }
  assert.equal(
    countries.find((item) => item.code === "VA")?.callingCode,
    "+39",
  );
});

test("valid national numbers normalize to E.164 without mutating the draft", () => {
  for (const [country, phone, normalized] of [
    ["MD", "069123456", "+37369123456"],
    ["RO", "0721234567", "+40721234567"],
    ["DE", "030 901820", "+4930901820"],
    ["GB", "020 7946 0018", "+442079460018"],
  ]) {
    const input = Object.freeze({ ...draft, country, phone });
    assert.deepEqual(validateContactForm(input), {
      valid: true,
      data: { name: "Анна", country, phone: normalized, comment: "" },
    });
    assert.equal(input.phone, phone);
  }
});

test("field errors cover required, invalid, oversized and non-string inputs", () => {
  const cases: [Partial<ContactFormInput>, string, string][] = [
    [{ name: "" }, "name", "required"],
    [{ name: " \t\n " }, "name", "required"],
    [{ name: "а".repeat(101) }, "name", "too_long"],
    [{ comment: "а".repeat(1001) }, "comment", "too_long"],
    [{ phone: "" }, "phone", "required"],
    [{ phone: "   " }, "phone", "required"],
    [{ phone: "123" }, "phone", "invalid"],
    [{ phone: "not a number" }, "phone", "invalid"],
    [{ phone: "Call +37369123456 please" }, "phone", "invalid"],
    [{ country: "ZZ" }, "country", "invalid"],
    [{ country: "US" }, "country", "invalid"],
    [{ country: "__proto__" }, "country", "invalid"],
    [{ country: null }, "country", "invalid"],
    [{ name: null }, "name", "invalid"],
    [{ phone: 123 }, "phone", "invalid"],
    [{ comment: {} }, "comment", "invalid"],
  ];
  for (const [changes, field, error] of cases) {
    const result = validateContactForm({ ...draft, ...changes });
    assert.equal(result.valid, false);
    if (!result.valid) {
      assert.equal(Reflect.get(result.errors, field), error);
      assert.ok(!("data" in result));
    }
  }
});

test("limits are inclusive and independent field errors are returned together", () => {
  assert.equal(
    validateContactForm({
      ...draft,
      name: "а".repeat(100),
      comment: "а".repeat(1000),
    }).valid,
    true,
  );
  assert.deepEqual(
    validateContactForm({
      ...draft,
      name: " ",
      phone: "",
      comment: "а".repeat(1001),
    }),
    {
      valid: false,
      errors: { name: "required", comment: "too_long", phone: "required" },
    },
  );
});

test("leading + uses the international prefix, retaining the selected country", () => {
  assert.deepEqual(
    validateContactForm({ ...draft, country: "MD", phone: "+44 20 7946 0018" }),
    {
      valid: true,
      data: {
        name: "Анна",
        country: "MD",
        phone: "+442079460018",
        comment: "",
      },
    },
  );
});
