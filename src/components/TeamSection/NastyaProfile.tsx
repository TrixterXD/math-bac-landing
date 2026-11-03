"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import type { Messages } from "@/i18n/messages.types";
import purpleMath from "../../../public/images/team/purple-math.png";
import styles from "./NastyaProfile.module.css";
import TeacherCard from "./TeacherCard";
import type { Teacher } from "./team.data";

type NastyaProfileProps = {
  teacher: Teacher;
  messages: Messages["team"]["profile"];
};

export default function NastyaProfile({
  teacher,
  messages,
}: NastyaProfileProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <TeacherCard
        teacher={teacher}
        messages={messages}
        onOpen={() => dialogRef.current?.showModal()}
      />
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
      >
        <div className={styles.header}>
          <h2 id={titleId}>{messages.title}</h2>
          <button
            type="button"
            className={styles.close}
            onClick={() => dialogRef.current?.close()}
          >
            {messages.close}
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.visual}>
            <Image
              className={styles.portrait}
              src={teacher.image}
              alt={teacher.alt}
              width={teacher.width}
              height={teacher.height}
              sizes="(width < 640px) 192px, 256px"
            />
            <Image
              className={styles.decoration}
              src={purpleMath}
              alt=""
              sizes="256px"
            />
          </div>
          <div className={styles.biography}>
            {messages.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
