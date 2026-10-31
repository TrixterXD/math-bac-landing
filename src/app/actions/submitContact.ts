"use server";

import {
  type ContactNotificationResult,
  sendContactNotification,
} from "../../lib/sendContactNotification";
import {
  type ContactFieldErrors,
  type ContactFormInput,
  validateContactForm,
} from "../../lib/validateContactForm";

export type ContactSubmissionResult =
  | { status: "validation_error"; errors: ContactFieldErrors }
  | ContactNotificationResult
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
    return await sendContactNotification(result.data);
  } catch {
    return { status: "server_error" };
  }
}
