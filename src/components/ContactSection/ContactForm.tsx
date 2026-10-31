"use client";

import { startTransition, useRef, useState } from "react";
import { submitContact } from "@/app/actions/submitContact";
import {
  type ContactFieldErrors,
  getSupportedInternationalCountry,
  validateContactForm,
} from "@/lib/validateContactForm";
import styles from "./ContactForm.module.css";
import { contactErrorMessages } from "./contactErrors.data";
import { countries } from "./countries.data";

type ContactFormData = {
  name: string;
  country: string;
  phone: string;
  comment: string;
};

type SubmissionState =
  | { status: "idle" | "pending" | "accepted" }
  | { status: "error"; message: string };

const emptyDraft: ContactFormData = {
  name: "",
  country: "MD",
  phone: "",
  comment: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(emptyDraft);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
  });
  const submitting = useRef(false);

  const [errors, setErrors] = useState<ContactFieldErrors | null>(null);

  function validateDraft(draft: ContactFormData) {
    const result = validateContactForm(draft);
    setErrors(result.valid ? {} : result.errors);
  }

  function updateField(field: keyof ContactFormData, value: string) {
    if (submitting.current) return;
    setSubmission({ status: "idle" });
    const next = { ...formData, [field]: value };
    setFormData(next);
    if (errors !== null) validateDraft(next);
  }

  function synchronizeCountry() {
    const country = getSupportedInternationalCountry(formData.phone);
    const next = country ? { ...formData, country } : formData;
    if (next.country !== formData.country) setFormData(next);
    return next;
  }

  function handleSubmit() {
    if (submitting.current || submission.status === "accepted") return;
    const draft = synchronizeCountry();
    const validation = validateContactForm(draft);
    setErrors(validation.valid ? {} : validation.errors);
    if (!validation.valid) {
      setSubmission({ status: "idle" });
      return;
    }

    // Lock synchronously: React's disabled rendering alone cannot stop same-tick submits.
    submitting.current = true;
    setSubmission({ status: "pending" });
    startTransition(async () => {
      try {
        const result = await submitContact(draft);
        switch (result.status) {
          case "validation_error":
            setErrors(result.errors);
            setSubmission({ status: "idle" });
            break;
          case "accepted":
            setFormData(emptyDraft);
            setErrors(null);
            setSubmission({ status: "accepted" });
            break;
          case "delivery_error":
            setSubmission({
              status: "error",
              message:
                "Не удалось подтвердить отправку заявки. Данные сохранены. Заявка могла быть принята — не отправляйте её повторно, пока результат не уточнён.",
            });
            break;
          case "server_error":
            setSubmission({
              status: "error",
              message:
                "Не удалось обработать заявку на сервере. Данные сохранены. Попробуйте позже.",
            });
            break;
        }
      } catch {
        setSubmission({
          status: "error",
          message:
            "Связь с сервером прервалась. Не удалось подтвердить результат отправки. Данные сохранены; не отправляйте заявку повторно, пока результат не уточнён.",
        });
      } finally {
        submitting.current = false;
      }
    });
  }

  function renderError(field: keyof ContactFormData) {
    const error = errors?.[field];
    return error ? (
      <span className={styles.error} id={`contact-${field}-error`}>
        {contactErrorMessages[field][error]}
      </span>
    ) : null;
  }

  const errorCount = Object.keys(errors ?? {}).length;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <fieldset
        className={styles.card}
        aria-describedby="contact-preview"
        disabled={submission.status === "pending"}
      >
        <legend className={styles.legend}>Заявка на подготовку</legend>
        <label className={styles.field} htmlFor="contact-name">
          Имя <span>(обязательно)</span>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={(event) => updateField("name", event.currentTarget.value)}
            aria-invalid={errors?.name ? true : undefined}
            aria-describedby={errors?.name ? "contact-name-error" : undefined}
            required
            placeholder="Как к вам обращаться?"
          />
          {renderError("name")}
        </label>
        <div className={styles.field}>
          <label htmlFor="contact-phone">
            Телефон <span>(обязательно)</span>
          </label>
          <div className={styles.phone}>
            <select
              className={styles.country}
              id="contact-country"
              aria-label="Страна и телефонный код"
              value={formData.country}
              aria-invalid={errors?.country ? true : undefined}
              aria-describedby={
                errors?.country ? "contact-country-error" : undefined
              }
              onChange={(event) =>
                updateField("country", event.currentTarget.value)
              }
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.callingCode} — {country.name}
                </option>
              ))}
            </select>
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel-national"
              value={formData.phone}
              onChange={(event) =>
                updateField("phone", event.currentTarget.value)
              }
              onBlur={() => {
                const next = synchronizeCountry();
                if (errors !== null) validateDraft(next);
              }}
              aria-invalid={errors?.phone ? true : undefined}
              aria-describedby={
                errors?.phone ? "contact-phone-error" : undefined
              }
              required
              placeholder="69 123 456"
            />
          </div>
          {renderError("country")}
          {renderError("phone")}
        </div>
        <label className={styles.field} htmlFor="contact-comment">
          Комментарий <span>(необязательно)</span>
          <textarea
            id="contact-comment"
            rows={3}
            value={formData.comment}
            onChange={(event) =>
              updateField("comment", event.currentTarget.value)
            }
            aria-invalid={errors?.comment ? true : undefined}
            aria-describedby={
              errors?.comment ? "contact-comment-error" : undefined
            }
            placeholder="Класс, трудности с математикой или цель подготовки"
          />
          {renderError("comment")}
        </label>
        <p
          className={
            submission.status === "error" || errorCount > 0
              ? styles.errorSummary
              : styles.feedback
          }
          aria-live="polite"
          aria-atomic="true"
        >
          {submission.status === "pending"
            ? "Отправляем заявку…"
            : submission.status === "accepted"
              ? "Заявка принята для обработки. Это не подтверждает доставку письма в почтовый ящик. Чтобы оставить новую заявку, начните заполнять форму."
              : submission.status === "error"
                ? submission.message
                : errorCount > 0
                  ? `Проверьте отмеченные поля: ${errorCount}.`
                  : ""}
        </p>
        <button
          className={styles.button}
          type="submit"
          disabled={
            submission.status === "pending" || submission.status === "accepted"
          }
          aria-describedby="contact-preview"
        >
          {submission.status === "pending" ? "Отправляем…" : "Отправить заявку"}
          <span aria-hidden="true">→</span>
        </button>
        <p className={styles.preview} id="contact-preview">
          Учебный прототип: форма отправляет настоящее тестовое письмо. Во время
          контролируемого тестирования не вводите реальные персональные данные.
        </p>
      </fieldset>
    </form>
  );
}
