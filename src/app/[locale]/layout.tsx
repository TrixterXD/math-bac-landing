import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "@/components/Footer/Footer";
import LocaleShell from "@/components/Header/LocaleShell";
import { getMessages } from "@/i18n/getMessages";
import { isLocale, supportedLocales } from "@/i18n/locales";
import { getSocialImageUrl } from "@/lib/getSocialImageUrl";
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
  const metadata = (await getMessages(locale)).metadata;
  const image = {
    url: getSocialImageUrl(),
    width: 1200,
    height: 630,
    alt:
      locale === "ro"
        ? "Sigla EasyMath cu o coroană și accente violet"
        : "Логотип EasyMath с короной и фиолетовыми акцентами",
  };

  return {
    ...metadata,
    openGraph: {
      ...metadata,
      type: "website",
      locale: locale === "ro" ? "ro_MD" : "ru_MD",
      images: [image],
    },
    twitter: {
      ...metadata,
      card: "summary_large_image",
      images: [image],
    },
  };
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
