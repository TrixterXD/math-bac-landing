import assert from "node:assert/strict";
import { test } from "node:test";
import { getCountryCallingCode, isSupportedCountry } from "libphonenumber-js";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { countries } from "../components/ContactSection/countries.data";
import {
  type ContactFormInput,
  getSupportedInternationalCountry,
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

test("Unicode names allow letter segments and single supported separators", () => {
  for (const name of [
    "Анастасия",
    "Ion",
    "Ana-Maria",
    "Мария Попеску",
    "O'Connor",
    "Ștefan",
    "Иван-Кузьмич",
    "O’Connor",
    "S\u0326tefan",
    "Jose\u0301",
    "李明",
    "محمد",
    "अनन्या",
  ]) {
    const input = Object.freeze({ ...draft, name });
    const result = validateContactForm(input);
    assert.equal(result.valid, true, name);
    if (result.valid) assert.equal(result.data.name, name);
    assert.equal(input.name, name);
  }
});

test("names reject digits, symbols, orphan marks and malformed separators", () => {
  for (const name of [
    "123456",
    "Ion123",
    "!!!",
    "-Иван",
    "Анна😊",
    "Анна-",
    "'Ion",
    "Ion’",
    "--",
    "Анна--Мария",
    "Анна  Мария",
    "O''Connor",
    "Анна -Мария",
    "Анна- Мария",
    "Анна\tМария",
    "Анна\nМария",
    "\u0301Анна",
    "Анна-\u0301Мария",
    "Ion_Popescu",
    "Ion. Popescu",
    "Ion١",
  ]) {
    const result = validateContactForm({ ...draft, name });
    assert.equal(result.valid, false, name);
    if (!result.valid) assert.equal(result.errors.name, "invalid", name);
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

test("country synchronization only identifies valid supported international numbers", () => {
  for (const [phone, country] of [
    ["+37369123456", "MD"],
    ["+40721234567", "RO"],
    ["+4930901820", "DE"],
    [" +44 20 7946 0018 ", "GB"],
  ]) {
    assert.equal(getSupportedInternationalCountry(phone), country);
  }
  for (const phone of [
    "",
    "+",
    "+4",
    "+44 20",
    "069123456",
    "+1 213 373 4253",
    "+800 12345678",
  ]) {
    assert.equal(getSupportedInternationalCountry(phone), undefined);
  }
});

test("valid unsupported or unidentified international numbers are rejected without guessing", () => {
  const cases: [string, string | undefined][] = [
    ["+12133734253", "US"],
    ["+61412345678", "AU"],
    ["+80012345678", undefined],
  ];
  for (const [phone, detected] of cases) {
    const parsed = parsePhoneNumberFromString(phone);
    assert.equal(parsed?.isValid(), true);
    assert.equal(parsed?.country, detected);
    const input = Object.freeze({ ...draft, phone });
    const result = validateContactForm(input);
    assert.equal(result.valid, false);
    if (!result.valid) assert.equal(result.errors.phone, "invalid");
    assert.equal(getSupportedInternationalCountry(phone), undefined);
    assert.equal(input.phone, phone);
    assert.equal(input.country, "MD");
  }
});

test("supported international numbers pass despite a selector mismatch and identify the sync target", () => {
  for (const [phone, country] of [
    ["+37369123456", "MD"],
    ["+40721234567", "RO"],
    ["+4930901820", "DE"],
    ["+442079460018", "GB"],
  ]) {
    assert.equal(validateContactForm({ ...draft, phone }).valid, true);
    assert.equal(getSupportedInternationalCountry(phone), country);
    const synced = validateContactForm({ ...draft, country, phone });
    assert.equal(synced.valid, true);
    if (synced.valid) {
      assert.equal(synced.data.country, country);
      assert.equal(synced.data.phone, phone);
    }
  }
});

test("leading + uses the international prefix, retaining the selected country until UI synchronization", () => {
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
