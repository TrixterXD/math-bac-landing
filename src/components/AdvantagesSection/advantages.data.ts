export type Advantage = {
  id: string;
  title: string;
  description: string;
  accent: "coral" | "mint" | "lilac";
  icon: string;
};

export const advantages: Advantage[] = [
  {
    id: "focus",
    title: "Фокус на результате",
    description:
      "Вариант подхода: разбирать формат BAC и тренироваться на заданиях экзамена, постепенно закрепляя темы.",
    accent: "coral",
    icon: "M20 12a8 8 0 1 1-8-8 M16 12a4 4 0 1 1-4-4 M12 12l9-9 M16 3h5v5",
  },
  {
    id: "support",
    title: "Поддержка и мотивация",
    description:
      "Вариант подхода: обсуждать трудности без страха ошибиться, задавать вопросы и замечать свой прогресс.",
    accent: "mint",
    icon: "M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M5 20v-3a7 7 0 0 1 14 0v3H5 M3 9a2 2 0 1 0 0 4 M21 9a2 2 0 1 1 0 4 M2 20v-3 M22 20v-3",
  },
  {
    id: "format",
    title: "Современный и удобный формат",
    description:
      "Вариант подхода: сочетать онлайн-занятия, учебные материалы и самостоятельную практику между уроками.",
    accent: "lilac",
    icon: "m3 8 4-5h10l4 5-9 13L3 8 M3 8h18 M7 3l5 18 5-18 M7 3l5 5 5-5",
  },
];
