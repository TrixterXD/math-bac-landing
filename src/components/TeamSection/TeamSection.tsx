import Image from "next/image";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
import NastyaProfile from "./NastyaProfile";
import TeacherCard from "./TeacherCard";
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
            {messages.heading} <span>{messages.headingEmphasis}</span>
          </h2>
          <p className={styles.description}>{messages.description}</p>
          <p className={styles.demo}>{messages.demo}</p>
        </div>
        <div className={styles.visual}>
          <ul className={styles.teachers} aria-label={messages.listLabel}>
            {teachers.map((teacher) => {
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
                  {teacher.id === "nastya" ? (
                    <NastyaProfile
                      teacher={localizedTeacher}
                      messages={messages.profile}
                    />
                  ) : (
                    <TeacherCard
                      teacher={localizedTeacher}
                      messages={messages.profile}
                    />
                  )}
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
            width={1448}
            height={1086}
            sizes="280px"
          />
          <Image
            className={styles.arrow}
            src="/images/team/arrow.png"
            alt=""
            width={1254}
            height={1254}
            sizes="72px"
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
