import Image from "next/image";
import TeacherCard from "./TeacherCard";
import styles from "./TeamSection.module.css";
import { teachers } from "./team.data";

export default function TeamSection() {
  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="team-heading"
      lang="ru"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="team-heading" className={styles.heading}>
            Настя <span>и команда</span>
          </h2>
          <p className={styles.description}>
            Мы верим, что каждый ученик может сдать BAC на высокий балл — нужно
            только правильно выстроенное сопровождение, понятные объяснения и
            поддержка.
          </p>
          <p className={styles.demo}>
            Учебный прототип: текст и портреты команды — демонстрационные, не
            подтверждённый состав школы.
          </p>
        </div>
        <div className={styles.visual}>
          <ul className={styles.teachers} aria-label="Преподаватели — демо">
            {teachers.map((teacher) => (
              <li key={teacher.id}>
                <TeacherCard teacher={teacher} />
              </li>
            ))}
          </ul>
          <Image
            className={styles.crown}
            src="/images/team/crown.png"
            alt=""
            width={1254}
            height={1254}
            sizes="72px"
          />
          <Image
            className={styles.note}
            src="/images/team/team-note.png"
            alt=""
            width={1448}
            height={1086}
            sizes="280px"
          />
          <Image
            className={styles.arrow}
            src="/images/team/arrow.png"
            alt=""
            width={1254}
            height={1254}
            sizes="72px"
          />
          <Image
            className={styles.spark}
            src="/images/team/spark.png"
            alt=""
            width={1254}
            height={1254}
            sizes="64px"
          />
        </div>
      </div>
    </section>
  );
}
