import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "@/components/Footer/Footer";
import LocaleShell from "@/components/Header/LocaleShell";
import { getMessages } from "@/i18n/getMessages";
import { isLocale, supportedLocales } from "@/i18n/locales";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

type LocaleParams = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (await getMessages(locale)).metadata;
}

export default async function RootLayout({
  children,
  params,
}: LocaleParams & { children: ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={manrope.variable}>
      <body>
        <LocaleShell key={locale} locale={locale} messages={messages.header}>
          {children}
          <Footer locale={locale} messages={messages.footer} />
        </LocaleShell>
      </body>
    </html>
  );
}
