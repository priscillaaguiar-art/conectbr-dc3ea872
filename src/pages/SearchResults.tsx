import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { t } from "@/lib/i18n";
import { CATEGORIES, ONTARIO_CITIES } from "@/lib/data";
import { useApprovedBusinesses } from "@/hooks/use-businesses";
import { useLang } from "@/lib/LangContext";

export default function SearchResults() {
  const { lang, setLang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("categoria") ?? "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("cidade") ?? "");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const navigate = useNavigate();
  const { data: businesses = [], isLoading } = useApprovedBusinesses();

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setSelectedCategory(searchParams.get("categoria") ?? "");
    setSelectedCity(searchParams.get("cidade") ?? "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCity) params.set("cidade", selectedCity);
    if (selectedCategory) params.set("categoria", selectedCategory);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const results = useMemo(() => {
    return businesses.filter((b) => {
      const q = query.toLowerCase();
      const matchQuery = !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.category.includes(q);
      const matchCat = !selectedCategory || b.category === selectedCategory;
      const matchCity = !selectedCity || b.city.toLowerCase().includes(selectedCity.toLowerCase());
      const matchType = !selectedType || b.type === selectedType;
      return matchQuery && matchCat && matchCity && matchType;
    }).sort((a, b) => {
      if (sortBy === "recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });
  }, [businesses, query, selectedCategory, selectedCity, selectedType, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedCity("");
    setSelectedType("");
    setQuery("");
  };

  const hasFilters = selectedCategory || selectedCity || selectedType || query;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar lang={lang} onLangChange={setLang} />

      {/* Search bar */}
      <div className="bg-card border-b border-border py-4 px-4 sticky top-16 z-40">
        <div className="container mx-auto flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 flex-1 bg-background border border-border rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(lang, "search_what")}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="flex items-center gap-3 sm:w-52 bg-background border border-border rounded-xl px-4 py-2.5">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              placeholder={t(lang, "search_where")}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className="btn-primary py-2.5 px-5 text-sm">
            {t(lang, "search_btn")}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 border border-border rounded-xl px-4 py-2.5 text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t(lang, "filters")}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? "block" : "hidden"} sm:block w-full sm:w-64 shrink-0`}>
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-36">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold text-sm">{t(lang, "filters")}</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {lang === "pt" ? "Limpar" : "Clear"}
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {t(lang, "filter_category")}
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none input-search text-sm pr-8"
                  >
                    <option value="">{t(lang, "all_categories")}</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.emoji} {t(lang, c.labelKey as any)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* City */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {t(lang, "filter_city")}
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full appearance-none input-search text-sm pr-8"
                  >
                    <option value="">{t(lang, "all_cities")}</option>
                    {ONTARIO_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Type */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {t(lang, "filter_type")}
                </label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full appearance-none input-search text-sm pr-8"
                  >
                    <option value="">{t(lang, "all_types")}</option>
                    <option value="company">{t(lang, "type_company")}</option>
                    <option value="freelancer">{t(lang, "type_freelancer")}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {t(lang, "filter_sort")}
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none input-search text-sm pr-8"
                  >
                    <option value="relevance">{t(lang, "sort_relevance")}</option>
                    <option value="recent">{t(lang, "sort_recent")}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">
                {t(lang, "results_title")}
                <span className="text-base font-normal text-muted-foreground ml-2">
                  ({results.length} {t(lang, "results_found")})
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4 animate-pulse">⏳</div>
                <p className="text-muted-foreground">{lang === "pt" ? "Carregando..." : "Loading..."}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="font-display font-semibold text-xl text-foreground mb-2">
                  {t(lang, "no_results")}
                </p>
                <p className="text-muted-foreground">{t(lang, "no_results_desc")}</p>
                <button onClick={clearFilters} className="btn-primary mt-6">
                  {lang === "pt" ? "Ver todos" : "Show all"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((b) => (
                  <BusinessCard key={b.id} business={b} lang={lang} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
