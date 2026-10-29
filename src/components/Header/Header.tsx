import { navigationItems } from "./Header.data";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header} lang="ru">
      <div className={styles.inner}>
        <a className={styles.brand} href="/" aria-label="Math BAC — главная">
          Math <span>BAC</span>
        </a>
        <nav aria-label="Основная навигация">
          <ul className={styles.links}>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className={styles.cta} href="#contact">
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
