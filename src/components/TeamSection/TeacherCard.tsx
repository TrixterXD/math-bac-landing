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
        {messages.badge}{" "}
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 7v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      </span>
    </button>
  );
}
