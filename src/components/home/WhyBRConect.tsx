import { Users, ShieldCheck, LayoutGrid, Zap } from "lucide-react";
import { Lang, t } from "@/lib/i18n";

interface Props { lang: Lang }

const REASONS = [
  { icon: Users, titleKey: "why_community_title" as const, descKey: "why_community_desc" as const },
  { icon: ShieldCheck, titleKey: "why_trust_title" as const, descKey: "why_trust_desc" as const },
  { icon: LayoutGrid, titleKey: "why_central_title" as const, descKey: "why_central_desc" as const },
  { icon: Zap, titleKey: "why_easy_title" as const, descKey: "why_easy_desc" as const },
];

export function WhyBRConect({ lang }: Props) {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <p className="text-amarelo text-sm font-semibold uppercase tracking-wider mb-3">
          {lang === "pt" ? "Nossos diferenciais" : "Our differentials"}
        </p>
        <h2 className="section-title text-3xl md:text-4xl">{t(lang, "why_title")}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {REASONS.map((r, i) => (
          <div
            key={r.titleKey}
            className="bg-white border border-border rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-verde/20 group animate-fade-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="w-12 h-12 rounded-xl bg-verde-light flex items-center justify-center mx-auto mb-4 group-hover:bg-verde/10 transition-colors">
              <r.icon className="w-6 h-6 text-verde" />
            </div>
            <h3 className="font-display font-bold text-base text-dark mb-2">{t(lang, r.titleKey)}</h3>
            <p className="text-mid text-sm leading-relaxed">{t(lang, r.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
