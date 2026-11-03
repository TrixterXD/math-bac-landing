import Image from "next/image";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
import FAQItem from "./FAQItem";
import styles from "./FAQSection.module.css";
import { faqItems } from "./faq.data";

export default function FAQSection({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages["faq"];
}) {
  const columnSize = Math.ceil(faqItems.length / 2);

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.inner}>
        <h2 id="faq-heading" className={styles.heading}>
          {messages.heading}
        </h2>
        <div className={styles.body}>
          <div className={styles.items}>
            {[0, 1].map((column) => (
              <div key={column} className={styles.column}>
                {faqItems
                  .slice(column * columnSize, (column + 1) * columnSize)
                  .map((item) => (
                    <FAQItem
                      key={item.id}
                      item={{ ...item, ...messages.items[item.id] }}
                    />
                  ))}
              </div>
            ))}
          </div>
          <Image
            className={styles.note}
            src={`/images/faq/questions-note_${locale}.png`}
            alt=""
            width={1428}
            height={1101}
            sizes="240px"
          />
        </div>
      </div>
    </section>
  );
}
