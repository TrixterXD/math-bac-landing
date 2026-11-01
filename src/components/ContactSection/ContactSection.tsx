import Image from "next/image";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
import ContactForm from "./ContactForm";
import styles from "./ContactSection.module.css";

export default function ContactSection({
  locale,
  messages,
  countryNames,
  turnstileMessages,
}: {
  locale: Locale;
  messages: Messages["contact"];
  countryNames: Messages["countries"];
  turnstileMessages: Messages["turnstile"];
}) {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-heading"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="contact-heading" className={styles.heading}>
            {messages.heading}
            <br />
            <span>{messages.headingEmphasis}</span>
          </h2>
          <p className={styles.description}>{messages.description}</p>
          <Image
            className={styles.arrow}
            src="/images/contacts/paper-plane-trail.png"
            alt=""
            width={2172}
            height={724}
            sizes="(max-width: 1023px) 160px, 256px"
          />
        </div>
        <ContactForm
          locale={locale}
          messages={messages}
          countryNames={countryNames}
          turnstileMessages={turnstileMessages}
        />
        <Image
          className={styles.note}
          src={`/images/contacts/bac-note_${locale}.png`}
          alt=""
          width={1122}
          height={1402}
          sizes="(max-width: 1023px) 160px, 212px"
        />
      </div>
    </section>
  );
}
