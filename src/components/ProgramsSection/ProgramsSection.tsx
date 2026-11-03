import Image from "next/image";
import type { Messages } from "@/i18n/messages.types";
import ProgramCard from "./ProgramCard";
import styles from "./ProgramsSection.module.css";
import { programs } from "./programs.data";

export default function ProgramsSection({
  messages,
}: {
  messages: Messages["programs"];
}) {
  return (
    <section id="programs" className={styles.section} aria-labelledby="programs-heading">
      <div className={styles.header}>
        <h2 id="programs-heading" className={styles.heading}>{messages.heading}</h2>
        <Image
          className={styles.decoration}
          src="/images/hero/math-pyramid.png"
          alt=""
          width={1472}
          height={1062}
          sizes="(max-width: 640px) 96px, 160px"
        />
      </div>
      <div className={styles.items}>
        {programs.map(({ id }) => (
          <ProgramCard
            key={id}
            id={id}
            program={messages.items[id]}
          />
        ))}
      </div>
    </section>
  );
}
