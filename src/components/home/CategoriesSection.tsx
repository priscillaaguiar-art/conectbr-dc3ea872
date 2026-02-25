import { useNavigate } from "react-router-dom";
import { Lang, t } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/data";

interface Props { lang: Lang }

export function CategoriesSection({ lang }: Props) {
  const navigate = useNavigate();

  return (
    <section className="bg-muted/40 py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            {lang === "pt" ? "Navegue por área" : "Browse by area"}
          </p>
          <h2 className="section-title text-3xl md:text-4xl">{t(lang, "categories_title")}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.key}
              onClick={() => navigate(`/busca?categoria=${cat.key}`)}
              className="group bg-primary rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-primary-light shadow-card hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">{cat.emoji}</div>
              <span className="text-sm font-semibold text-primary-foreground">
                {t(lang, cat.labelKey as any)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
