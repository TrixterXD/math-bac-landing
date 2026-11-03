import type { Messages } from "@/i18n/messages.types";

export type Review = {
  id: keyof Messages["team"]["reviews"];
  fullName: string;
  role: string;
  text: string;
  expansion?: Messages["team"]["reviews"]["elena"]["expansion"];
};

export const reviewIds: Review["id"][] = [
  "corina",
  "bianca",
  "andreea",
  "parent",
  "dumitru",
  "milenaMother",
  "elena",
];
