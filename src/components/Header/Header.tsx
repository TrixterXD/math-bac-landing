"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { navigationItems } from "./Header.data";
import styles from "./Header.module.css";

export default function Header() {
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
    <header className={styles.header} lang="ru">
      <div className={styles.inner}>
        <a className={styles.brand} href="/" aria-label="Math BAC — главная">
          Math <span>BAC</span>
        </a>
        <button
          ref={toggleRef}
          className={styles.toggle}
          type="button"
          aria-expanded={isOpen}
          aria-controls="header-navigation"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
        >
          <span aria-hidden="true">{isOpen ? "×" : "☰"}</span>
        </button>
        <nav
          id="header-navigation"
          className={styles.navigation}
          data-open={isOpen}
          aria-label="Основная навигация"
        >
          <ul className={styles.links}>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClickCapture={closeMenu}
                  onKeyDown={handleKeyDown}
                >
                  {item.label}
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
          Оставить заявку
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
      </div>
    </header>
  );
}
