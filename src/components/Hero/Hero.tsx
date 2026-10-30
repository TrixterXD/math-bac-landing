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
                <span>
                  {benefit.text}
                  <span className={styles.benefitDetail}>{benefit.detail}</span>
                  {benefit.ending}
                </span>
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
          <Image
            className={styles.pyramid}
            src="/images/hero/math-pyramid.png"
            alt=""
            width={1448}
            height={1086}
            sizes="(width < 1280px) min(30vw - 10px, 144px), 144px"
          />
          <Image
            className={styles.portrait}
            src="/images/hero/nastya-hero.png"
            alt="Настя сидит за столом с тетрадью и ручкой"
            width={1086}
            height={1448}
            sizes="(width < 1280px) min(100vw - 32px, 360px), 536px"
            preload
          />
          <Image
            className={styles.lessonNote}
            src="/images/hero/lesson-note.png"
            alt=""
            width={1448}
            height={1086}
            sizes="(width < 1280px) min(27vw - 9px, 128px), 192px"
          />
        </div>
        <Image
          className={styles.mathNote}
          src="/images/hero/math-note.png"
          alt=""
          width={1448}
          height={1086}
          sizes="(width < 1280px) min(30vw - 10px, 202px), 280px"
        />
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
