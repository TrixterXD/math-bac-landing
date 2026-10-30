import Image from "next/image";
import FAQItem from "./FAQItem";
import styles from "./FAQSection.module.css";
import { faqItems } from "./faq.data";

export default function FAQSection() {
  const columnSize = Math.ceil(faqItems.length / 2);

  return (
    <section
      id="faq"
      className={styles.section}
      aria-labelledby="faq-heading"
      lang="ru"
    >
      <div className={styles.inner}>
        <h2 id="faq-heading" className={styles.heading}>
          Часто задаваемые вопросы
        </h2>
        <p className={styles.demo}>
          Учебный прототип: ответы ниже — демонстрационные заглушки, а не
          подтверждённые условия школы.
        </p>
        <div className={styles.body}>
          <div className={styles.items}>
            {[0, 1].map((column) => (
              <div key={column} className={styles.column}>
                {faqItems
                  .slice(column * columnSize, (column + 1) * columnSize)
                  .map((item) => (
                    <FAQItem key={item.id} item={item} />
                  ))}
              </div>
            ))}
          </div>
          <Image
            className={styles.note}
            src="/images/faq/questions-note.png"
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
