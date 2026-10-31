export type Locale = "ro" | "ru";

export const supportedLocales: readonly Locale[] = ["ro", "ru"];
export const defaultLocale: Locale = "ro";

export function isLocale(value: unknown): value is Locale {
  return supportedLocales.some((locale) => locale === value);
}
