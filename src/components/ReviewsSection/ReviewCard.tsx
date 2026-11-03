import styles from "./ReviewCard.module.css";
import type { Review } from "./reviews.data";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.reviewer}>
        <span className={styles.avatar} aria-hidden="true">
          {review.initials}
        </span>
        <div>
          <h4 className={styles.name}>{review.fullName}</h4>
          <p className={styles.role}>{review.role}</p>
        </div>
      </header>
      <p className={styles.text}>{review.text}</p>
      <p className={styles.demo}>Fictional sample review</p>
    </article>
  );
}
