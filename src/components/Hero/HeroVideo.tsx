"use client";

import { useId, useRef, useState } from "react";
import type { Messages } from "@/i18n/messages.types";
import styles from "./HeroVideo.module.css";

export default function HeroVideo({
  messages,
}: {
  messages: Messages["hero"]["video"];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const backdropPress = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const titleId = useId();

  function isOutside(dialog: HTMLDialogElement, x: number, y: number) {
    const bounds = dialog.getBoundingClientRect();
    return (
      x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        onClick={(event) => {
          event.currentTarget.focus();
          dialogRef.current?.showModal();
          setIsPlaying(true);
        }}
      >
        <span className={styles.play} aria-hidden="true">
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 4v16l13-8Z" />
          </svg>
        </span>
        <span>{messages.play}</span>
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        onPointerDown={(event) => {
          backdropPress.current = isOutside(
            event.currentTarget,
            event.clientX,
            event.clientY,
          );
        }}
        onPointerUp={(event) => {
          if (
            backdropPress.current &&
            isOutside(event.currentTarget, event.clientX, event.clientY)
          ) {
            dialogRef.current?.close();
          }
          backdropPress.current = false;
        }}
        onClose={() => {
          setIsPlaying(false);
          backdropPress.current = false;
          triggerRef.current?.focus();
        }}
      >
        <div className={styles.header}>
          <h2 id={titleId}>{messages.title}</h2>
          <button
            type="button"
            className={styles.close}
            aria-label={messages.close}
            onClick={() => dialogRef.current?.close()}
          >
            {messages.close}
          </button>
        </div>
        {isPlaying && (
          <iframe
            className={styles.player}
            src="https://www.tiktok.com/player/v1/7690978841367416085"
            title={messages.iframeTitle}
            referrerPolicy="no-referrer"
            allow="fullscreen"
            allowFullScreen
          />
        )}
      </dialog>
    </>
  );
}
