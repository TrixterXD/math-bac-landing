"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

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

  function updateField(field: keyof ContactFormData, value: string) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
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
            required
            placeholder="Как к вам обращаться?"
          />
        </label>
        <div className={styles.field}>
          <label htmlFor="contact-phone">
            Телефон <span>(обязательно)</span>
          </label>
          <div className={styles.phone}>
            <span className={styles.country} id="contact-country">
              {formData.country} +373
            </span>
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel-national"
              value={formData.phone}
              onChange={(event) =>
                updateField("phone", event.currentTarget.value)
              }
              aria-describedby="contact-country"
              required
              placeholder="69 123 456"
            />
          </div>
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
            placeholder="Класс, трудности с математикой или цель подготовки"
          />
        </label>
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
