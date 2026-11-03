export const programs = [
  { id: "middle" },
  { id: "ninth" },
  { id: "bac" },
] as const;

export type ProgramId = (typeof programs)[number]["id"];

export type Program = {
  title: string;
  groups: {
    heading?: string;
    content: string | string[];
  }[];
};
