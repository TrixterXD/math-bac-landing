import Image from "next/image";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
import noteRo from "../../../public/images/footer/footer-note_ro.png";
import noteRu from "../../../public/images/footer/footer-note_ru.png";
import pyramid from "../../../public/images/footer/footer-pyramid-formula.png";
import sigma from "../../../public/images/footer/footer-sigma.png";
import styles from "./Footer.module.css";
import LegalDialog from "./LegalDialog";

export default function Footer({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages["footer"];
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.brandArea}>
            <a className={styles.brand} href="#page-top">
              EasyMath
            </a>
            <p className={styles.description}>{messages.description}</p>
            <div className={styles.socials}>
              <a
                href="https://www.tiktok.com/@anastasia.easymath?_r=1&_t=ZS-9AM5WYzAttc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  role="img"
                  aria-label={messages.tiktokLabel}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14 3h3c0 2.2 1.8 4 4 4v3a7 7 0 0 1-4-1.3V16a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V3Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/anastasia.easymath/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  role="img"
                  aria-label={messages.instagramLabel}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
            </div>
            <Image className={styles.sigma} src={sigma} alt="" sizes="64px" />
          </div>
          <nav aria-labelledby="footer-navigation-heading">
            <h2 id="footer-navigation-heading" className={styles.heading}>
              {messages.navigationTitle}
            </h2>
            <ul className={styles.links}>
              <li>
                <a href="#page-top">{messages.home}</a>
              </li>
              <li>
                <a href="#about">{messages.about}</a>
              </li>
              <li>
                <a href="#advantages">{messages.advantages}</a>
              </li>
              <li>
                <a href="#faq">{messages.faq}</a>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className={styles.heading}>{messages.informationTitle}</h2>
            <ul className={styles.links}>
              <li>
                <LegalDialog
                  title={messages.terms}
                  closeLabel={messages.close}
                />
              </li>
              <li>
                <LegalDialog
                  title={messages.privacy}
                  closeLabel={messages.close}
                />
              </li>
            </ul>
          </div>
          <div className={styles.contact}>
            <h2 className={styles.heading}>{messages.contactTitle}</h2>
            <a className={styles.contactLink} href="#contact">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 6 9 7 9-7" />
              </svg>
              {messages.contactLink}
            </a>
            <Image
              className={styles.pyramid}
              src={pyramid}
              alt=""
              sizes="120px"
            />
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© 2026 EasyMath. {messages.copyright}</p>
          <Image
            className={styles.phrase}
            src={locale === "ro" ? noteRo : noteRu}
            alt=""
            sizes="(max-width: 540px) calc(100vw - 48px), 400px"
          />
        </div>
      </div>
    </footer>
  );
}
