import { notFound } from "next/navigation";
import AdvantagesSection from "@/components/AdvantagesSection/AdvantagesSection";
import ContactSection from "@/components/ContactSection/ContactSection";
import FAQSection from "@/components/FAQSection/FAQSection";
import Hero from "@/components/Hero/Hero";
import ProgramsSection from "@/components/ProgramsSection/ProgramsSection";
import TeamSection from "@/components/TeamSection/TeamSection";
import { getMessages } from "@/i18n/getMessages";
import { isLocale } from "@/i18n/locales";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);

  return (
    <main>
      <Hero locale={locale} messages={messages.hero} />
      <TeamSection locale={locale} messages={messages.team} />
      <AdvantagesSection locale={locale} messages={messages.advantages} />
      <ProgramsSection locale={locale} messages={messages.programs} />
      <FAQSection locale={locale} messages={messages.faq} />
      <ContactSection
        locale={locale}
        messages={messages.contact}
        countryNames={messages.countries}
        turnstileMessages={messages.turnstile}
      />
    </main>
  );
}
