"use client";

import { useId, useRef } from "react";
import styles from "./Footer.module.css";

export default function LegalDialog({
  title,
  closeLabel,
}: {
  title: string;
  closeLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.legalLink}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        {title}
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        onClose={() => triggerRef.current?.focus()}
      >
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className={styles.close}
          onClick={() => dialogRef.current?.close()}
        >
          {closeLabel}
        </button>
      </dialog>
    </>
  );
}
