import Image from "next/image";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
import programNoteRo from "../../../public/images/programs/program-note_ro.png";
import programNoteRu from "../../../public/images/programs/program-note_ru.png";
import spark from "../../../public/images/team/spark.png";
import ProgramCard from "./ProgramCard";
import styles from "./ProgramsSection.module.css";
import { programs } from "./programs.data";

export default function ProgramsSection({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages["programs"];
}) {
  return (
    <section
      id="programs"
      className={styles.section}
      aria-labelledby="programs-heading"
    >
      <div className={styles.header}>
        <h2 id="programs-heading" className={styles.heading}>
          <span className={styles.headingAccent}>{messages.heading}</span>{" "}
          <span className={styles.headingEnding}>
            {messages.headingEnding}
            <Image className={styles.spark} src={spark} alt="" sizes="40px" />
          </span>
        </h2>
        <Image
          className={styles.programNote}
          src={locale === "ro" ? programNoteRo : programNoteRu}
          alt=""
          sizes="(max-width: 640px) 224px, 288px"
        />
      </div>
      <div className={styles.items}>
        {programs.map(({ id }) => (
          <ProgramCard
            key={id}
            id={id}
            locale={locale}
            program={messages.items[id]}
          />
        ))}
      </div>
    </section>
  );
}
