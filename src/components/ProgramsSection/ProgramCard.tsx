import Image from "next/image";
import type { Locale } from "@/i18n/locales";
import matematicaNoteRo from "../../../public/images/programs/matematica-note_ro.png";
import matematicaNoteRu from "../../../public/images/programs/matematica-note_ru.png";
import styles from "./ProgramsSection.module.css";
import type { Program, ProgramId } from "./programs.data";

const symbols = { middle: "x²", ninth: "π", bac: "∑" };

export default function ProgramCard({
  id,
  locale,
  program,
}: {
  id: ProgramId;
  locale: Locale;
  program: Program;
}) {
  return (
    <details name="programs" className={styles.card}>
      <summary className={styles.summary}>
        <span className={styles.symbol} aria-hidden="true">
          {symbols[id]}
        </span>
        <span className={styles.title}>{program.title}</span>
        <span className={styles.indicator} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="m5 9 7 7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </summary>
      <div className={styles.content}>
        <div className={styles.text}>
          {program.groups.map((group) => (
            <div key={group.heading ?? program.title}>
              {group.heading && (
                <h3 className={styles.subheading}>{group.heading}</h3>
              )}
              {typeof group.content === "string" ? (
                <p>{group.content}</p>
              ) : (
                <ul className={styles.list}>
                  {group.content.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <Image
          className={styles.notebook}
          src={locale === "ro" ? matematicaNoteRo : matematicaNoteRu}
          alt=""
          sizes="(max-width: 640px) 280px, (max-width: 960px) 240px, 320px"
        />
      </div>
    </details>
  );
}
