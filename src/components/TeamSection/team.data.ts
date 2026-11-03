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
    image: "/images/team/nastya_ro.png",
    alt: "Настя — основатель и преподаватель математики",
    width: 1122,
    height: 1402,
  },
];
