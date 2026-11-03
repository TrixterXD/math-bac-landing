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
      <h2 id="programs-heading">{messages.heading}</h2>
      <p>{messages.demo}</p>
      <div className={styles.items}>
        {programs.map(({ id }) => (
          <ProgramCard
            key={id}
            program={messages.items[id]}
            detailsLabel={messages.detailsLabel}
            closeLabel={messages.closeLabel}
            demo={messages.demo}
          />
        ))}
      </div>
    </section>
  );
}
