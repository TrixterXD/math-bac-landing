import type { Messages } from "@/i18n/messages.types";
import ReviewsCarousel from "./ReviewsCarousel";
import styles from "./ReviewsSection.module.css";
import { reviewIds } from "./reviews.data";

export default function ReviewsSection({
  heading,
  reviews,
  navigation,
}: {
  heading: string;
  reviews: Messages["team"]["reviews"];
  navigation: Messages["team"]["reviewsNavigation"];
}) {
  return (
    <section aria-labelledby="reviews-heading">
      <h3 id="reviews-heading" className={styles.heading}>
        {heading}
      </h3>
      <ReviewsCarousel
        navigation={navigation}
        reviews={reviewIds.map((id) => ({ id, ...reviews[id] }))}
      />
    </section>
  );
}
