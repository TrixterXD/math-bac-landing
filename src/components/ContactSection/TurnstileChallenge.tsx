"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
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
      language: Locale;
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
  locale,
  messages,
  onToken,
  onRetry,
  requested,
}: {
  locale: Locale;
  messages: Messages["turnstile"];
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
      setMessage(messages.unavailable);
      return;
    }
    const delay = window.setTimeout(() => {
      if (active) setMessage(messages.loading);
    }, 3000);
    const fail = (text: string) => {
      if (!active) return;
      window.clearTimeout(delay);
      setWaiting(false);
      onToken("");
      setMessage(text);
      setCanRetry(true);
    };
    const timer = window.setTimeout(() => fail(messages.loadError), 15000);
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
            setMessage(messages.interactionRequired);
          },
          "after-interactive-callback": () => {
            if (!active) return;
            setWaiting(true);
            setMessage(messages.loading);
          },
          theme: "light",
          language: locale,
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
            fail(messages.verificationError);
            return true;
          },
          "expired-callback": () => fail(messages.expired),
          "timeout-callback": () => fail(messages.timeout),
        });
      } catch {
        fail(messages.renderError);
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
        fail(messages.loadError);
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
  }, [siteKey, onToken, locale, messages]);

  return (
    <div className={styles.challenge}>
      <div className={styles.challengeWidget} ref={container} />
      <p
        className={styles.challengeStatus}
        aria-live="polite"
        aria-atomic="true"
      >
        {message || (waiting && requested ? messages.loading : "")}
      </p>
      {canRetry && (
        <button
          type="button"
          className={styles.challengeRetry}
          onClick={onRetry}
        >
          {messages.retry}
        </button>
      )}
    </div>
  );
}
