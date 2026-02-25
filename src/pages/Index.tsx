import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { WhyBRConect } from "@/components/home/WhyBRConect";
import { CTASection } from "@/components/home/CTASection";
import { AboutSection } from "@/components/home/AboutSection";
import { Lang } from "@/lib/i18n";

export default function Index() {
  const [lang, setLang] = useState<Lang>("pt");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar lang={lang} onLangChange={setLang} />
      <HeroSection lang={lang} />
      <HowItWorks lang={lang} />
      <CategoriesSection lang={lang} />
      <WhyBRConect lang={lang} />
      <CTASection lang={lang} />
      <AboutSection lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
