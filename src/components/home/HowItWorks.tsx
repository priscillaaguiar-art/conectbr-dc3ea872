import { Search, Eye, MessageCircle } from "lucide-react";
import { Lang, t } from "@/lib/i18n";

interface Props { lang: Lang }

const STEPS = [
  { icon: Search, titleKey: "how_step1_title" as const, descKey: "how_step1_desc" as const, num: "01" },
  { icon: Eye, titleKey: "how_step2_title" as const, descKey: "how_step2_desc" as const, num: "02" },
  { icon: MessageCircle, titleKey: "how_step3_title" as const, descKey: "how_step3_desc" as const, num: "03" },
];

export function HowItWorks({ lang }: Props) {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
          {lang === "pt" ? "Simples e rápido" : "Simple & fast"}
        </p>
        <h2 className="section-title text-3xl md:text-4xl">{t(lang, "how_title")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="text-center group animate-fade-up"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="relative mb-6 mx-auto w-fit">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                {step.num}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">{t(lang, step.titleKey)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{t(lang, step.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
