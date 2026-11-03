import type { Program, ProgramId } from "./programs.data";
import styles from "./ProgramsSection.module.css";

const symbols = { middle: "∑", ninth: "x²", bac: "π" };

export default function ProgramCard({
  id,
  program,
}: {
  id: ProgramId;
  program: Program;
}) {
  return (
    <details name="programs" className={styles.card}>
      <summary className={styles.summary}>
        <span className={styles.symbol} aria-hidden="true">{symbols[id]}</span>
        <span className={styles.title}>{program.title}</span>
        <span className={styles.indicator} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </summary>
      <div className={styles.content}>
        {program.groups.map((group) => (
          <div key={group.heading ?? program.title}>
            {group.heading && <h3 className={styles.subheading}>{group.heading}</h3>}
            {typeof group.content === "string" ? (
              <p>{group.content}</p>
            ) : (
              <ul className={styles.list}>
                {group.content.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
