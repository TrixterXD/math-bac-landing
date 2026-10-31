import type { CountryCode, E164Number } from "libphonenumber-js";
import {
  isSupportedCountry,
  parsePhoneNumberFromString,
} from "libphonenumber-js/max";
import { countries } from "../components/ContactSection/countries.data";

export type ContactFormInput = {
  name: unknown;
  country: unknown;
  phone: unknown;
  comment: unknown;
};

export type FieldError = "required" | "too_long" | "invalid";
export type ContactFieldErrors = Partial<
  Record<keyof ContactFormInput, FieldError>
>;

export type ContactValidationResult =
  | {
      valid: true;
      data: {
        name: string;
        country: CountryCode;
        phone: E164Number;
        comment: string;
      };
    }
  | { valid: false; errors: ContactFieldErrors };

type PhoneValidationResult =
  | { valid: true; phone: E164Number; country: CountryCode }
  | { valid: false; error: FieldError };

export function validatePhoneNumber(
  value: unknown,
  country?: CountryCode,
): PhoneValidationResult {
  if (typeof value !== "string") return { valid: false, error: "invalid" };
  if (!value.trim()) return { valid: false, error: "required" };
  if (country && !isSupportedCountry(country)) {
    return { valid: false, error: "invalid" };
  }

  // A leading + overrides defaultCountry; supported mismatches are synchronized by the UI.
  const phone = parsePhoneNumberFromString(value.trim(), {
    defaultCountry: country,
    extract: false,
  });
  if (!phone?.isValid()) return { valid: false, error: "invalid" };
  // Unknown/ambiguous countries and non-geographic numbers cannot select an approved country.
  if (
    !phone.country ||
    !countries.some((item) => item.code === phone.country)
  ) {
    return { valid: false, error: "invalid" };
  }
  return { valid: true, phone: phone.number, country: phone.country };
}

export function getSupportedInternationalCountry(
  value: string,
): CountryCode | undefined {
  if (!value.trim().startsWith("+")) return undefined;
  const result = validatePhoneNumber(value);
  return result.valid ? result.country : undefined;
}

export function validateContactForm(
  input: ContactFormInput,
): ContactValidationResult {
  const errors: ContactFieldErrors = {};
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const comment = typeof input.comment === "string" ? input.comment : "";
  const country = countries.find((item) => item.code === input.country)?.code;

  if (typeof input.name !== "string") errors.name = "invalid";
  else if (!name) errors.name = "required";
  else if (name.length > 100) errors.name = "too_long";
  // Each segment starts with a letter; marks attach to letters, never to separators.
  else if (!/^(?:\p{L}\p{M}*)+(?:[ '\u2019-](?:\p{L}\p{M}*)+)*$/u.test(name)) {
    errors.name = "invalid";
  }

  if (!country || !isSupportedCountry(country)) errors.country = "invalid";

  if (typeof input.comment !== "string") errors.comment = "invalid";
  else if (comment.length > 1000) errors.comment = "too_long";

  const phone: PhoneValidationResult = country
    ? validatePhoneNumber(input.phone, country)
    : { valid: false, error: "invalid" };
  if (!phone.valid) errors.phone = phone.error;

  if (Object.keys(errors).length > 0 || !country || !phone.valid) {
    return { valid: false, errors };
  }
  return {
    valid: true,
    data: { name, country, phone: phone.phone, comment: comment.trim() },
  };
}
