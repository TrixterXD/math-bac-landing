"use client";

import { type ReactNode, type SyntheticEvent, useRef, useState } from "react";
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
  const contactUsed = useRef(false);
  const [switchingLocked, setSwitchingLocked] = useState(false);

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
    window.location.assign(
      `/${nextLocale}${window.location.search}${window.location.hash}`,
    );
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
        onLocaleChange={switchLocale}
      />
      {children}
    </div>
  );
}
