"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ContactForm.module.css";

type Turnstile = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      size: "compact";
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
}: {
  onToken: (token: string) => void;
  onRetry: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("Загружаем проверку безопасности…");
  const [canRetry, setCanRetry] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    let active = true;
    let widgetId: string | undefined;
    let script: HTMLScriptElement | undefined;
    onToken("");
    setCanRetry(false);
    setMessage("Загружаем проверку безопасности…");
    if (!siteKey) {
      setMessage("Проверка безопасности не настроена. Отправка недоступна.");
      return;
    }
    const fail = (text: string) => {
      if (!active) return;
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
          theme: "light",
          language: "ru",
          retry: "never",
          "refresh-expired": "manual",
          "refresh-timeout": "manual",
          "response-field": false,
          callback: (token) => {
            if (!active) return;
            onToken(token);
            setMessage("Проверка безопасности пройдена.");
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
        setMessage("Пройдите проверку безопасности перед отправкой.");
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
      if (widgetId !== undefined) window.turnstile?.remove(widgetId);
      script?.remove();
    };
  }, [siteKey, onToken]);

  return (
    <div className={styles.challenge}>
      <div className={styles.challengeWidget} ref={container} />
      <p className={styles.preview} aria-live="polite">
        {message}
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
