"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import styles from "./NastyaProfile.module.css";
import TeacherCard from "./TeacherCard";
import type { Teacher } from "./team.data";

type NastyaProfileProps = {
  teacher: Teacher;
};

export default function NastyaProfile({ teacher }: NastyaProfileProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <TeacherCard
        teacher={teacher}
        onOpen={() => dialogRef.current?.showModal()}
      />
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
      >
        <div className={styles.header}>
          <h2 id={titleId}>О Насте</h2>
          <button
            type="button"
            className={styles.close}
            onClick={() => dialogRef.current?.close()}
          >
            Закрыть
          </button>
        </div>
        <div className={styles.content}>
          <Image
            className={styles.portrait}
            src={teacher.image}
            alt={teacher.alt}
            width={teacher.width}
            height={teacher.height}
            sizes="(width < 640px) 192px, 256px"
          />
          <div>
            <h3 className={styles.demoHeading}>Демонстрационная биография</h3>
            <p className={styles.notice}>
              Текст-заглушка для учебного прототипа. Это не реальные сведения о
              Насте; биография будет добавлена после согласования.
            </p>
            <p lang="la">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              vitae justo eget magna fermentum iaculis. Donec vel sapien at quam
              tincidunt viverra.
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
