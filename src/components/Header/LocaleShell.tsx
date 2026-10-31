"use client";

import { useRouter } from "next/navigation";
import {
  type ReactNode,
  type SyntheticEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
import Header from "./Header";

export default function LocaleShell({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: Locale;
  messages: Messages["header"];
}) {
  const router = useRouter();
  const contactUsed = useRef(false);
  const switching = useRef(false);
  const [switchingLocked, setSwitchingLocked] = useState(false);
  const [switchFailed, setSwitchFailed] = useState(false);
  const [isSwitching, startTransition] = useTransition();

  function lockSwitching() {
    contactUsed.current = true;
    setSwitchingLocked(true);
  }

  function handleContactEvent(event: SyntheticEvent) {
    if (
      event.target instanceof Element &&
      event.target.closest("#contact form")
    ) {
      lockSwitching();
    }
  }

  function switchLocale(nextLocale: Locale) {
    if (switching.current || nextLocale === locale) return;
    // shortcut: lock for the whole visit after contact use, revisit with an explicit form-state contract.
    const hasAutofill = [
      ...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        "#contact-name, #contact-phone, #contact-comment",
      ),
    ].some((field) => field.value.length > 0);
    if (contactUsed.current || hasAutofill) {
      lockSwitching();
      return;
    }
    const destination = `/${nextLocale}${window.location.search}${window.location.hash}`;
    switching.current = true;
    setSwitchFailed(false);
    startTransition(async () => {
      try {
        // Persist even on a router-cache hit, without downloading a second HTML body.
        const response = await fetch(`/${nextLocale}`, {
          method: "HEAD",
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error("Locale preference request failed");
        startTransition(() => router.push(destination, { scroll: false }));
      } catch {
        setSwitchFailed(true);
      } finally {
        switching.current = false;
      }
    });
  }

  return (
    <div
      onFocusCapture={handleContactEvent}
      onInputCapture={handleContactEvent}
      onChangeCapture={handleContactEvent}
      onSubmitCapture={handleContactEvent}
    >
      <Header
        locale={locale}
        messages={messages}
        switchingLocked={switchingLocked}
        isSwitching={isSwitching}
        switchFailed={switchFailed}
        onLocaleChange={switchLocale}
      />
      <div inert={isSwitching}>{children}</div>
    </div>
  );
}
