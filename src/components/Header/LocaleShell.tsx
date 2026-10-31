"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState, useTransition } from "react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
import {
  ContactCoordinationContext,
  createContactCoordination,
} from "./contactCoordination";
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
  const [switchingLocked, setSwitchingLocked] = useState(false);
  const [coordination] = useState(() =>
    createContactCoordination(setSwitchingLocked),
  );
  const [switchFailed, setSwitchFailed] = useState(false);
  const [isSwitching, startTransition] = useTransition();

  useEffect(() => {
    if (!isSwitching) coordination.endNavigation();
  }, [isSwitching, coordination]);

  function switchLocale(nextLocale: Locale) {
    if (
      nextLocale === locale ||
      !coordination.beginNavigation(() => window.confirm(messages.discardDraft))
    )
      return;
    const destination = `/${nextLocale}${window.location.search}${window.location.hash}`;
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
      }
    });
  }

  return (
    <ContactCoordinationContext value={coordination}>
      <Header
        locale={locale}
        messages={messages}
        switchingLocked={switchingLocked}
        isSwitching={isSwitching}
        switchFailed={switchFailed}
        onLocaleChange={switchLocale}
      />
      <div inert={isSwitching}>{children}</div>
    </ContactCoordinationContext>
  );
}
