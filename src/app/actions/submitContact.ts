"use server";

import {
  type ContactFieldErrors,
  type ContactFormInput,
  validateContactForm,
} from "../../lib/validateContactForm";

export type ContactSubmissionResult =
  | { status: "validation_error"; errors: ContactFieldErrors }
  | { status: "delivery_not_implemented" }
  | { status: "server_error" };

export async function submitContact(
  input: ContactFormInput,
): Promise<ContactSubmissionResult> {
  try {
    // TypeScript cannot protect the runtime boundary from malformed external payloads.
    const draft =
      input !== null && typeof input === "object" && !Array.isArray(input)
        ? input
        : undefined;
    const result = validateContactForm({
      name: draft?.name,
      country: draft?.country,
      phone: draft?.phone,
      comment: draft?.comment,
    });
    if (!result.valid) {
      return { status: "validation_error", errors: result.errors };
    }
    return { status: "delivery_not_implemented" };
  } catch {
    return { status: "server_error" };
  }
}
