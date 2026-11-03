"use client";

import { useId, useRef } from "react";
import type { Program } from "./programs.data";
import styles from "./ProgramsSection.module.css";

export default function ProgramCard({
  program,
  detailsLabel,
  closeLabel,
  demo,
}: {
  program: Program;
  detailsLabel: string;
  closeLabel: string;
  demo: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  return (
    <>
      <details name="programs" className={styles.card}>
        <summary className={styles.summary}>
          <span>
            <strong className={styles.title}>{program.title}</strong>
            <span>{program.description}</span>
          </span>
        </summary>
        <div className={styles.content}>
          <p>{program.preview}</p>
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="dialog"
            onClick={() => dialogRef.current?.showModal()}
          >
            {detailsLabel}
          </button>
        </div>
      </details>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        onClose={() => triggerRef.current?.focus()}
      >
        <div className={styles.content}>
          <h3 id={titleId}>{program.title}</h3>
          <button type="button" onClick={() => dialogRef.current?.close()}>
            {closeLabel}
          </button>
          <p>{demo}</p>
          <p>{program.details}</p>
        </div>
      </dialog>
    </>
  );
}
