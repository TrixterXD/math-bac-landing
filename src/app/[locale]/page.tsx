import { notFound } from "next/navigation";
import AdvantagesSection from "@/components/AdvantagesSection/AdvantagesSection";
import ContactSection from "@/components/ContactSection/ContactSection";
import FAQSection from "@/components/FAQSection/FAQSection";
import Hero from "@/components/Hero/Hero";
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
      <Hero messages={messages.hero} />
      <TeamSection messages={messages.team} />
      <AdvantagesSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}
