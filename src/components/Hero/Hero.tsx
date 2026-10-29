import Image from "next/image";
import { heroBenefits } from "./Hero.data";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading" lang="ru">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.pill}>
            Онлайн-школа · Математика · Подготовка к BAC
          </p>
          <h1 id="hero-heading" className={styles.heading}>
            Подготовка к BAC
            <span>по математике онлайн</span>
          </h1>
          <p className={styles.description}>
            Уверенные знания. Спокойные родители.
            <br />
            Высокие результаты на экзамене.
          </p>
          <ul className={styles.benefits}>
            {heroBenefits.map((benefit) => (
              <li key={benefit.text}>
                <span className={styles.icon}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path
                      d={benefit.icon}
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{benefit.text}</span>
              </li>
            ))}
          </ul>
          <a className={styles.cta} href="#contact">
            Оставить заявку <span aria-hidden="true">⟶</span>
          </a>
          <p className={styles.demo}>
            Учебный прототип: описание и преимущества — демонстрационные.
          </p>
        </div>
        <div className={styles.visual}>
          <div className={styles.blob} aria-hidden="true" />
          <svg
            className={styles.pyramid}
            aria-hidden="true"
            viewBox="0 0 90 100"
            fill="none"
          >
            <path
              d="M44 4 4 78l45 15 35-17L44 4Zm0 0 5 89M4 78l40-13 40 11M44 4v61"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <Image
            className={styles.portrait}
            src="/images/hero/nastya-hero.png"
            alt="Настя сидит за столом с тетрадью и ручкой"
            width={1086}
            height={1448}
            sizes="(width < 568px) calc(100vw - 32px), 536px"
            preload
          />
          <Image
            className={styles.note}
            src="/images/hero/note.png"
            alt=""
            width={737}
            height={724}
            sizes="280px"
          />
        </div>
      </div>
      <svg
        className={styles.boundary}
        aria-hidden="true"
        viewBox="0 0 1440 50"
        preserveAspectRatio="none"
      >
        <path d="M0 22C180 50 290 9 480 25s300 12 430 0 330 34 530-6v31H0Z" />
      </svg>
    </section>
  );
}
