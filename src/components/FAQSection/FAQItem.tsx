import styles from "./FAQItem.module.css";
import type { FAQ } from "./faq.data";

type FAQItemProps = {
  item: FAQ;
  answerPrefix: string;
};

export default function FAQItem({ item, answerPrefix }: FAQItemProps) {
  return (
    <details className={styles.item} name="faq">
      <summary className={styles.question}>
        <span>{item.question}</span>
        <svg
          className={styles.indicator}
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" />
          <path
            className={styles.vertical}
            d="M12 5v14"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </summary>
      <p className={styles.answer}>
        <strong>{answerPrefix}</strong>
        {item.answer}
      </p>
    </details>
  );
}
