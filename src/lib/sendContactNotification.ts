import "server-only";

import { Resend } from "resend";
import { countries } from "../components/ContactSection/countries.data";
import type { ContactValidationResult } from "./validateContactForm";

type ValidatedContact = Extract<
  ContactValidationResult,
  { valid: true }
>["data"];

export type ContactNotificationResult =
  | { status: "accepted" }
  | { status: "delivery_error" };

export async function sendContactNotification(
  contact: ValidatedContact,
): Promise<ContactNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL?.trim();
  // The SDK's debug mode can log raw provider errors, so refuse sends with it enabled.
  if (!apiKey || !recipient || process.env.RESEND_DEBUG === "true") {
    return { status: "delivery_error" };
  }

  const country = countries.find((item) => item.code === contact.country);
  const text = [
    "Заявка на связь — учебный прототип Math BAC",
    "",
    `Имя: ${contact.name}`,
    `Телефон: ${contact.phone}`,
    `Выбранная страна: ${country?.name ?? contact.country} (${contact.country})`,
    ...(contact.comment ? ["", "Комментарий:", contact.comment] : []),
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send(
      {
        from: "onboarding@resend.dev",
        to: [recipient],
        subject: "Math BAC — заявка из учебного прототипа",
        text,
      },
      { signal: AbortSignal.timeout(15000) },
    );
    return !error && data?.id
      ? { status: "accepted" }
      : { status: "delivery_error" };
  } catch {
    // A thrown transport failure can leave delivery uncertain; never retry automatically.
    return { status: "delivery_error" };
  }
}
