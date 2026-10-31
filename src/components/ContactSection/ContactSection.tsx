import Image from "next/image";
import ContactForm from "./ContactForm";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-heading"
      lang="ru"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="contact-heading" className={styles.heading}>
            Остались вопросы
            <br />
            <span>или хотите записаться?</span>
          </h2>
          <p className={styles.description}>
            Оставьте заявку, чтобы обсудить вопросы о подготовке к BAC по
            математике онлайн.
          </p>
          <Image
            className={styles.arrow}
            src="/images/contacts/paper-plane-trail.png"
            alt=""
            width={2172}
            height={724}
            sizes="(max-width: 1023px) 160px, 256px"
          />
        </div>
        <ContactForm />
        <Image
          className={styles.note}
          src="/images/contacts/contact-note.png"
          alt=""
          width={1122}
          height={1402}
          sizes="(max-width: 1023px) 160px, 212px"
        />
      </div>
    </section>
  );
}
