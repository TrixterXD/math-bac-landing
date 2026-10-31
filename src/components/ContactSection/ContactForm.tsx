"use client";

import { useState } from "react";
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

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    country: "MD",
    phone: "",
    comment: "",
  });

  const [errors, setErrors] = useState<ContactFieldErrors | null>(null);

  function validateDraft(draft: ContactFormData) {
    const result = validateContactForm(draft);
    setErrors(result.valid ? {} : result.errors);
  }

  function updateField(field: keyof ContactFormData, value: string) {
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
        validateDraft(synchronizeCountry());
      }}
    >
      <fieldset className={styles.card} aria-describedby="contact-preview">
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
          className={styles.errorSummary}
          aria-live="polite"
          aria-atomic="true"
        >
          {errorCount > 0 ? `Проверьте отмеченные поля: ${errorCount}.` : ""}
        </p>
        <button
          className={styles.button}
          type="submit"
          aria-describedby="contact-preview"
        >
          Отправить заявку <span aria-hidden="true">→</span>
        </button>
        <p className={styles.preview} id="contact-preview">
          Учебный макет: отправка пока не подключена. Не вводите реальные
          контактные данные.
        </p>
      </fieldset>
    </form>
  );
}
