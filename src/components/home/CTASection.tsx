import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Lang, t } from "@/lib/i18n";

interface Props { lang: Lang }

export function CTASection({ lang }: Props) {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="gradient-hero rounded-3xl p-10 md:p-16 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-amarelo/20" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
        <div className="relative z-10 max-w-xl">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4 leading-tight">
            {t(lang, "cta_title")}
          </h2>
          <p className="text-white/70 mb-8 text-lg leading-relaxed">
            {t(lang, "cta_desc")}
          </p>
          <button
            onClick={() => navigate("/cadastrar")}
            className="btn-accent inline-flex items-center gap-2 text-base px-8 py-4"
          >
            {t(lang, "cta_btn")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
