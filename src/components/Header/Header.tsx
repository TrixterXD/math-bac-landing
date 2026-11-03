"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { type Locale, supportedLocales } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages.types";
import { navigationItems } from "./Header.data";
import styles from "./Header.module.css";

export default function Header({
  locale,
  messages,
  switchingLocked,
  isSwitching,
  switchFailed,
  onLocaleChange,
}: {
  locale: Locale;
  messages: Messages["header"];
  switchingLocked: boolean;
  isSwitching: boolean;
  switchFailed: boolean;
  onLocaleChange: (locale: Locale) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && isOpen) {
      closeMenu();
      toggleRef.current?.focus();
    }
  }

  return (
    <header id="page-top" className={styles.header} lang={locale}>
      <div className={styles.inner}>
        <a
          className={styles.brand}
          href="#page-top"
          aria-label={messages.homeLabel}
        >
          Easy<span>Math</span>
        </a>
        <button
          ref={toggleRef}
          className={styles.toggle}
          type="button"
          aria-expanded={isOpen}
          aria-controls="header-navigation"
          aria-label={isOpen ? messages.closeMenu : messages.openMenu}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
        >
          <span aria-hidden="true">{isOpen ? "×" : "☰"}</span>
        </button>
        <nav
          id="header-navigation"
          className={styles.navigation}
          data-open={isOpen}
          aria-label={messages.navigationLabel}
        >
          <ul className={styles.links}>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClickCapture={closeMenu}
                  onKeyDown={handleKeyDown}
                >
                  {messages.navigation[item.id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          className={styles.cta}
          href="#contact"
          onClickCapture={closeMenu}
          onKeyDown={handleKeyDown}
        >
          {messages.cta}
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 12h16m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <fieldset
          className={styles.languages}
          aria-label={messages.languageLabel}
          aria-busy={isSwitching}
        >
          {supportedLocales.map((language) => (
            <button
              key={language}
              type="button"
              lang={language}
              aria-current={language === locale ? "true" : undefined}
              aria-describedby={
                switchingLocked || switchFailed
                  ? "locale-switch-notice"
                  : undefined
              }
              disabled={switchingLocked || isSwitching || language === locale}
              onClick={() => onLocaleChange(language)}
              onKeyDown={handleKeyDown}
            >
              {messages.languages[language]}
            </button>
          ))}
        </fieldset>
      </div>
      <p
        id="locale-switch-notice"
        className={styles.switchNotice}
        aria-live="polite"
        aria-atomic="true"
      >
        {switchingLocked
          ? messages.switchUnavailable
          : switchFailed
            ? messages.switchFailed
            : ""}
      </p>
    </header>
  );
}
