"use client";

import { useEffect, useState } from "react";
import type { Messages } from "@/i18n/messages.types";
import ReviewCard from "./ReviewCard";
import styles from "./ReviewsSection.module.css";
import type { Review } from "./reviews.data";

export default function ReviewsCarousel({
  reviews,
  navigation,
}: {
  reviews: Review[];
  navigation: Messages["team"]["reviewsNavigation"];
}) {
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
  }, [reviews.length]);

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
          aria-label={navigation.previous}
          disabled={currentPage === 0}
          onClick={() => setPage(Math.max(0, currentPage - 1))}
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5m7-7-7 7 7 7" />
          </svg>
        </button>
        <p aria-live="polite" aria-atomic="true">
          {pageCount === 0 ? 0 : currentPage + 1} / {pageCount}
        </p>
        <button
          type="button"
          className={styles.arrow}
          aria-label={navigation.next}
          disabled={currentPage >= pageCount - 1}
          onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
