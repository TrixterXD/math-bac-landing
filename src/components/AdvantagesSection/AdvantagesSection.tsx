import Image from "next/image";
import type { Messages } from "@/i18n/messages.types";
import AdvantageCard from "./AdvantageCard";
import styles from "./AdvantagesSection.module.css";
import { advantages } from "./advantages.data";

export default function AdvantagesSection({
  messages,
}: {
  messages: Messages["advantages"];
}) {
  return (
    <section
      id="advantages"
      className={styles.section}
      aria-labelledby="advantages-heading"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="advantages-heading" className={styles.heading}>
            {messages.heading}
          </h2>
          <div className={styles.artwork}>
            <Image
              className={styles.arrow}
              src="/images/team/arrow.png"
              alt=""
              width={1254}
              height={1254}
              sizes="56px"
            />
            <Image
              className={styles.note}
              src="/images/team/lesson-note.png"
              alt=""
              width={1448}
              height={1086}
              sizes="320px"
            />
          </div>
        </div>
        <ul className={styles.cards}>
          {advantages.map((advantage) => (
            <li key={advantage.id}>
              <AdvantageCard
                advantage={{ ...advantage, ...messages.items[advantage.id] }}
              />
            </li>
          ))}
        </ul>
        <p className={styles.demo}>{messages.demo}</p>
      </div>
    </section>
  );
}
