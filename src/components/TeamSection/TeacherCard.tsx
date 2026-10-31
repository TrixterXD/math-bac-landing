import Image from "next/image";
import type { Messages } from "@/i18n/messages.types";
import styles from "./TeacherCard.module.css";
import type { Teacher } from "./team.data";

type TeacherCardProps = {
  teacher: Teacher;
  messages: Messages["team"]["profile"];
  onOpen?: () => void;
};

export default function TeacherCard({
  teacher,
  messages,
  onOpen,
}: TeacherCardProps) {
  const portrait = (
    <Image
      src={teacher.image}
      alt={teacher.alt}
      width={teacher.width}
      height={teacher.height}
      sizes="320px"
    />
  );

  if (!onOpen) return portrait;

  return (
    <button
      type="button"
      className={styles.card}
      aria-label={messages.title}
      aria-haspopup="dialog"
      onClick={(event) => {
        // Focus explicitly so mouse/touch activation also has a return target.
        event.currentTarget.focus();
        onOpen();
      }}
    >
      {portrait}
      <span className={styles.badge} aria-hidden="true">
        {messages.badge}
      </span>
    </button>
  );
}
