import AdvantagesSection from "@/components/AdvantagesSection/AdvantagesSection";
import FAQSection from "@/components/FAQSection/FAQSection";
import Hero from "@/components/Hero/Hero";
import TeamSection from "@/components/TeamSection/TeamSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <TeamSection />
      <AdvantagesSection />
      <FAQSection />
    </main>
  );
}
