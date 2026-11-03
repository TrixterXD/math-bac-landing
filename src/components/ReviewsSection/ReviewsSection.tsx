import type { Messages } from "@/i18n/messages.types";
import ReviewsCarousel from "./ReviewsCarousel";
import { reviewIds } from "./reviews.data";
import styles from "./ReviewsSection.module.css";

export default function ReviewsSection({
  heading,
  reviews,
}: {
  heading: string;
  reviews: Messages["team"]["reviews"];
}) {
  return (
    <section aria-labelledby="reviews-heading">
      <h3 id="reviews-heading" className={styles.heading}>{heading}</h3>
      <ReviewsCarousel
        reviews={reviewIds.map((id) => ({ id, ...reviews[id] }))}
      />
    </section>
  );
}
