import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Plus } from "lucide-react";
import { Lang, t } from "@/lib/i18n";

interface Props { lang: Lang }

export function HeroSection({ lang }: Props) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("cidade", city);
    navigate(`/busca?${params.toString()}`);
  };

  return (
    <section className="gradient-hero py-24 md:py-32 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary-foreground/5 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-accent/40 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm animate-fade-in">
          <span className="text-lg">🇧🇷</span>
          <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">
            {lang === "pt" ? "Comunidade Brasileira em Ontário" : "Brazilian Community in Ontario"}
          </span>
          <span className="text-lg">🍁</span>
        </div>

        {/* Headlines */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-primary-foreground mb-6 leading-[1.1] whitespace-pre-line text-balance animate-fade-up">
          {t(lang, "hero_title")}
        </h1>
        <p className="text-primary-foreground/70 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {t(lang, "hero_subtitle")}
        </p>

        {/* Search box */}
        <div className="bg-card rounded-2xl shadow-lg p-2 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 flex-1 bg-background rounded-xl px-4 py-3.5">
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
          <div className="flex items-center gap-3 flex-1 bg-background rounded-xl px-4 py-3.5">
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
          <button onClick={handleSearch} className="btn-accent flex items-center justify-center gap-2 px-6 py-3.5">
            <Search className="w-4 h-4" />
            <span>{t(lang, "search_btn")}</span>
          </button>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 mt-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={() => navigate("/cadastrar")}
            className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 rounded-xl px-5 py-3 text-sm font-semibold transition-all backdrop-blur-sm"
          >
            <Plus className="w-4 h-4" />
            {t(lang, "hero_cta_register")}
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-8 mt-10 animate-fade-up" style={{ animationDelay: "0.4s" }}>
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
  );
}
