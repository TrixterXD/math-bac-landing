import Image from "next/image";
import ReviewsSection from "@/components/ReviewsSection/ReviewsSection";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
import NastyaProfile from "./NastyaProfile";
import styles from "./TeamSection.module.css";
import { teachers } from "./team.data";

export default function TeamSection({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages["team"];
}) {
  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="team-heading"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="team-heading" className={styles.heading}>
            {messages.heading}
          </h2>
          <p className={styles.description}>{messages.description}</p>
          <div className={styles.reviews}>
            <ReviewsSection
              heading={messages.reviewsHeading}
              reviews={messages.reviews}
            />
          </div>
        </div>
        <div className={styles.visual}>
          <ul className={styles.teachers} aria-label={messages.listLabel}>
            {teachers
              .filter((teacher) => teacher.id === "nastya")
              .map((teacher) => {
                const localizedTeacher = {
                  ...teacher,
                  image:
                    teacher.id === "nastya"
                      ? `/images/team/nastya_${locale}.png`
                      : teacher.image,
                  alt: messages.portraits[teacher.id],
                };
                return (
                  <li key={teacher.id}>
                    <NastyaProfile
                      teacher={localizedTeacher}
                      messages={messages.profile}
                    />
                  </li>
                );
              })}
          </ul>
          <Image
            className={styles.crown}
            src="/images/team/crown.png"
            alt=""
            width={1254}
            height={1254}
            sizes="72px"
          />
          <Image
            className={styles.note}
            src={`/images/team/team-note_${locale}.png`}
            alt=""
            width={1672}
            height={941}
            sizes="(max-width: 1279px) 80px, 144px"
          />
          <Image
            className={styles.spark}
            src="/images/team/spark.png"
            alt=""
            width={1254}
            height={1254}
            sizes="64px"
          />
        </div>
      </div>
    </section>
  );
}
