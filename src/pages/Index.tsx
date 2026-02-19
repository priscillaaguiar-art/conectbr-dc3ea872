import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lang, t } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/data";

const CATEGORY_BG: Record<string, string> = {
  food: "from-amber-50 to-orange-50 border-amber-100 hover:border-amber-200",
  services: "from-blue-50 to-cyan-50 border-blue-100 hover:border-blue-200",
  beauty: "from-pink-50 to-rose-50 border-pink-100 hover:border-pink-200",
  health: "from-green-50 to-emerald-50 border-green-100 hover:border-green-200",
  products: "from-orange-50 to-yellow-50 border-orange-100 hover:border-orange-200",
  professionals: "from-indigo-50 to-violet-50 border-indigo-100 hover:border-indigo-200",
  transport: "from-sky-50 to-blue-50 border-sky-100 hover:border-sky-200",
  immigration: "from-teal-50 to-green-50 border-teal-100 hover:border-teal-200",
  others: "from-gray-50 to-slate-50 border-gray-100 hover:border-gray-200",
};

export default function Index() {
  const [lang, setLang] = useState<Lang>("pt");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("cidade", city);
    navigate(`/busca?${params.toString()}`);
  };

  const handleCategoryClick = (cat: string) => {
    navigate(`/busca?categoria=${cat}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar lang={lang} onLangChange={setLang} />

      {/* Hero */}
      <section className="gradient-hero py-20 md:py-28 px-4 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-foreground/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-accent/10 pointer-events-none" />

        <div className="container mx-auto relative z-10">
          {/* Flags badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <span className="text-lg">🇧🇷</span>
            <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wide">
              {lang === "pt" ? "Comunidade Brasileira em Ontário" : "Brazilian Community in Ontario"}
            </span>
            <span className="text-lg">🍁</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-4 leading-tight whitespace-pre-line text-balance">
            {t(lang, "hero_title")}
          </h1>
          <p className="text-primary-foreground/70 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            {t(lang, "hero_subtitle")}
          </p>

          {/* Search box */}
          <div className="bg-card rounded-2xl shadow-lg p-3 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex items-center gap-3 flex-1 bg-background rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(lang, "search_what")}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex items-center gap-3 flex-1 bg-background rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t(lang, "search_where")}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="btn-accent flex items-center justify-center gap-2 px-6">
              <Search className="w-4 h-4" />
              <span>{t(lang, "search_btn")}</span>
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { value: "9+", label: lang === "pt" ? "Categorias" : "Categories" },
              { value: "15+", label: lang === "pt" ? "Cidades" : "Cities" },
              { value: "100%", label: lang === "pt" ? "Gratuito" : "Free" },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="font-display font-bold text-xl text-accent">{value}</span>
                <span className="text-sm text-primary-foreground/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">{t(lang, "categories_title")}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className={`group bg-gradient-to-br ${CATEGORY_BG[cat.key]} border rounded-2xl p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-card`}
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {t(lang, cat.labelKey as any)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured businesses teaser */}
      <section className="bg-muted/50 py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm mb-3 font-medium uppercase tracking-wide">
            {lang === "pt" ? "Explore a plataforma" : "Explore the platform"}
          </p>
          <h2 className="section-title mb-3">
            {lang === "pt" ? "Encontre o que você precisa" : "Find what you need"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {lang === "pt"
              ? "Mais de 9 categorias de negócios e serviços brasileiros em toda Ontário."
              : "Over 9 categories of Brazilian businesses and services across Ontario."}
          </p>
          <button
            onClick={() => navigate("/busca")}
            className="btn-primary inline-flex items-center gap-2"
          >
            {lang === "pt" ? "Ver todos os negócios" : "View all businesses"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="gradient-hero rounded-3xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-accent/20" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary-foreground/5" />
          <div className="relative z-10 max-w-xl">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-primary-foreground mb-4">
              {t(lang, "cta_title")}
            </h2>
            <p className="text-primary-foreground/70 mb-8 text-lg leading-relaxed">
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

      <Footer lang={lang} />
    </div>
  );
}
