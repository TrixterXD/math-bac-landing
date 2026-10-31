import "server-only";
import type { Locale } from "./locales";

const dictionaries = {
  ro: () => import("./ro").then((module) => module.ro),
  ru: () => import("./ru").then((module) => module.ru),
};

export function getMessages(locale: Locale) {
  return dictionaries[locale]();
}
