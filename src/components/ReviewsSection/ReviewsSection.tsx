import ReviewsCarousel from "./ReviewsCarousel";
import styles from "./ReviewsSection.module.css";

export default function ReviewsSection() {
  return (
    <section lang="en" aria-labelledby="reviews-heading">
      <h3 id="reviews-heading" className={styles.heading}>Reviews</h3>
      <ReviewsCarousel />
    </section>
  );
}
