"use client";

import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { reviews } from "./reviews.data";
import styles from "./ReviewsSection.module.css";

export default function ReviewsCarousel() {
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const pageCount = Math.ceil(reviews.length / cardsPerPage);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const start = currentPage * cardsPerPage;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 40rem)");
    function updateViewport() {
      const count = desktop.matches ? 2 : 1;
      setCardsPerPage(count);
      setPage((previous) =>
        Math.min(previous, Math.max(0, Math.ceil(reviews.length / count) - 1)),
      );
    }
    updateViewport();
    desktop.addEventListener("change", updateViewport);
    return () => desktop.removeEventListener("change", updateViewport);
  }, []);

  return (
    <div>
      <ul className={styles.cards}>
        {reviews.slice(start, start + cardsPerPage).map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Previous reviews page"
          disabled={currentPage === 0}
          onClick={() => setPage(Math.max(0, currentPage - 1))}
        >
          <span aria-hidden="true">←</span>
        </button>
        <p aria-live="polite" aria-atomic="true">
          {pageCount === 0 ? 0 : currentPage + 1} / {pageCount}
        </p>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Next reviews page"
          disabled={currentPage >= pageCount - 1}
          onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
