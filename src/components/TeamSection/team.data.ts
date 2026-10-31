import type { Messages } from "../../i18n/messages.types";

export type Teacher = {
  id: keyof Messages["team"]["portraits"];
  image: string;
  alt: string;
  width: number;
  height: number;
};

export const teachers: Teacher[] = [
  {
    id: "nastya",
    image: "/images/team/nastya.png",
    alt: "Настя — основатель и преподаватель математики",
    width: 1122,
    height: 1402,
  },
  {
    id: "teacher-glasses",
    image: "/images/team/teacher-glasses.png",
    alt: "Демонстрационный портрет преподавателя в очках",
    width: 360,
    height: 353,
  },
  {
    id: "teacher-woman",
    image: "/images/team/teacher-woman.png",
    alt: "Демонстрационный портрет преподавательницы",
    width: 366,
    height: 353,
  },
  {
    id: "teacher-curly",
    image: "/images/team/teacher-curly.png",
    alt: "Демонстрационный портрет преподавателя с кудрявыми волосами",
    width: 365,
    height: 353,
  },
];
