export const programs = [
  { id: "middle" },
  { id: "ninth" },
  { id: "bac" },
] as const;

export type ProgramId = (typeof programs)[number]["id"];

export type Program = {
  title: string;
  description: string;
  preview: string;
  details: string;
};
