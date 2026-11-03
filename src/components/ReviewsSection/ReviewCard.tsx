"use client";

import { useId, useState } from "react";
import styles from "./ReviewCard.module.css";
import type { Review } from "./reviews.data";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const additionalTextId = useId();

  return (
    <article className={styles.card}>
      <header className={styles.reviewer}>
        <span className={styles.avatar} aria-hidden="true">
          {review.fullName
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase()}
        </span>
        <div>
          <h4 className={styles.name}>{review.fullName}</h4>
          <p className={styles.role}>{review.role}</p>
        </div>
      </header>
      <p className={styles.text}>{review.text}</p>
      {review.expansion && (
        <>
          <p id={additionalTextId} className={styles.text} hidden={!expanded}>
            {review.expansion.text}
          </p>
          <button
            type="button"
            className={styles.expand}
            aria-expanded={expanded}
            aria-controls={additionalTextId}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded
              ? review.expansion.collapseLabel
              : review.expansion.expandLabel}
          </button>
        </>
      )}
    </article>
  );
}
