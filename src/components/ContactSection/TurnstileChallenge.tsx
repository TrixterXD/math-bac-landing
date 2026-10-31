"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ContactForm.module.css";

type Turnstile = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      size: "compact";
      appearance: "interaction-only";
      execution: "render";
      "before-interactive-callback": () => void;
      "after-interactive-callback": () => void;
      theme: "light";
      language: "ru";
      retry: "never";
      "refresh-expired": "manual";
      "refresh-timeout": "manual";
      "response-field": false;
      callback: (token: string) => void;
      "error-callback": () => boolean;
      "expired-callback": () => void;
      "timeout-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export default function TurnstileChallenge({
  onToken,
  onRetry,
  requested,
}: {
  onToken: (token: string) => void;
  onRetry: () => void;
  requested: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [waiting, setWaiting] = useState(true);
  const [canRetry, setCanRetry] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    let active = true;
    let widgetId: string | undefined;
    let script: HTMLScriptElement | undefined;
    onToken("");
    setCanRetry(false);
    setMessage("");
    setWaiting(true);
    if (!siteKey) {
      setWaiting(false);
      setMessage("Проверка безопасности не настроена. Отправка недоступна.");
      return;
    }
    const delay = window.setTimeout(() => {
      if (active) setMessage("Проверка безопасности ещё выполняется…");
    }, 3000);
    const fail = (text: string) => {
      if (!active) return;
      window.clearTimeout(delay);
      setWaiting(false);
      onToken("");
      setMessage(text);
      setCanRetry(true);
    };
    const timer = window.setTimeout(
      () =>
        fail(
          "Проверка не загрузилась. Проверьте соединение и повторите проверку.",
        ),
      15000,
    );
    const render = () => {
      if (!active || !container.current || !window.turnstile) return;
      window.clearTimeout(timer);
      try {
        widgetId = window.turnstile.render(container.current, {
          sitekey: siteKey,
          size: "compact",
          appearance: "interaction-only",
          execution: "render",
          "before-interactive-callback": () => {
            if (!active) return;
            window.clearTimeout(delay);
            setWaiting(false);
            onToken("");
            setMessage("Пройдите проверку безопасности перед отправкой.");
          },
          "after-interactive-callback": () => {
            if (!active) return;
            setWaiting(true);
            setMessage("Проверка безопасности ещё выполняется…");
          },
          theme: "light",
          language: "ru",
          retry: "never",
          "refresh-expired": "manual",
          "refresh-timeout": "manual",
          "response-field": false,
          callback: (token) => {
            if (!active) return;
            window.clearTimeout(delay);
            setWaiting(false);
            onToken(token);
            setMessage("");
            setCanRetry(false);
          },
          "error-callback": () => {
            fail(
              "Не удалось пройти проверку. Повторите проверку безопасности.",
            );
            return true;
          },
          "expired-callback": () =>
            fail("Срок проверки истёк. Пройдите её ещё раз перед отправкой."),
          "timeout-callback": () =>
            fail("Время проверки истекло. Повторите проверку безопасности."),
        });
      } catch {
        fail("Не удалось загрузить проверку. Попробуйте повторить её.");
      }
    };
    if (window.turnstile) render();
    else {
      script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = render;
      script.onerror = () => {
        window.clearTimeout(timer);
        fail(
          "Проверка не загрузилась. Проверьте соединение и повторите проверку.",
        );
      };
      document.head.append(script);
    }
    return () => {
      active = false;
      window.clearTimeout(timer);
      window.clearTimeout(delay);
      if (widgetId !== undefined) window.turnstile?.remove(widgetId);
      script?.remove();
    };
  }, [siteKey, onToken]);

  return (
    <div className={styles.challenge}>
      <div className={styles.challengeWidget} ref={container} />
      <p
        className={styles.challengeStatus}
        aria-live="polite"
        aria-atomic="true"
      >
        {message ||
          (waiting && requested
            ? "Проверка безопасности ещё выполняется…"
            : "")}
      </p>
      {canRetry && (
        <button
          type="button"
          className={styles.challengeRetry}
          onClick={onRetry}
        >
          Повторить проверку
        </button>
      )}
    </div>
  );
}
