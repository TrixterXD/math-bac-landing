import styles from "./AdvantageCard.module.css";
import type { Advantage } from "./advantages.data";

type AdvantageCardProps = {
  advantage: Advantage;
};

export default function AdvantageCard({ advantage }: AdvantageCardProps) {
  return (
    <article className={styles.card}>
      <div className={`${styles.icon} ${styles[advantage.accent]}`}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path
            d={advantage.icon}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={styles.copy}>
        <h3 className={styles.title}>{advantage.title}</h3>
        <p className={styles.description}>{advantage.description}</p>
      </div>
    </article>
  );
}
