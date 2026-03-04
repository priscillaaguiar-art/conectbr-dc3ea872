import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Lang, t } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/data";
import type { BusinessRow } from "@/hooks/use-businesses";

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-amber-50 text-amber-700",
  services: "bg-azul-light text-azul",
  beauty: "bg-pink-50 text-pink-700",
  health: "bg-verde-light text-verde",
  products: "bg-orange-50 text-orange-700",
  professionals: "bg-indigo-50 text-indigo-700",
  transport: "bg-sky-50 text-sky-700",
  immigration: "bg-teal-50 text-teal-700",
  others: "bg-gray-50 text-gray-700",
};

interface BusinessCardProps {
  business: BusinessRow;
  lang: Lang;
}

export function BusinessCard({ business, lang }: BusinessCardProps) {
  const navigate = useNavigate();
  const cat = CATEGORIES.find((c) => c.key === business.category);
  const colorClass = CATEGORY_COLORS[business.category] ?? "bg-verde-muted text-mid";
  const catLabel = cat ? t(lang, cat.labelKey as any) : business.category;

  const initials = business.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="bg-white border border-border rounded-[18px] overflow-hidden shadow-card hover:-translate-y-1 hover:shadow-lg hover:border-verde/20 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/negocio/${business.id}`)}
    >
      <div className="aspect-video w-full relative overflow-hidden">
        {business.photo ? (
          <img src={business.photo} alt={business.name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full gradient-hero flex items-center justify-center">
            <span className="font-display font-bold text-3xl text-white">{initials}</span>
          </div>
        )}
        {business.type === "company" && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/30 rounded-lg text-white text-xs font-medium backdrop-blur-sm">
            {lang === "pt" ? "Empresa" : "Company"}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-base text-dark leading-snug line-clamp-1">
            {business.name}
          </h3>
        </div>

        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${colorClass}`}>
          {cat?.emoji} {catLabel}
        </span>

        <p className="text-sm text-mid line-clamp-2 mb-3 leading-relaxed">
          {lang === "en" && business.description_en ? business.description_en : business.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-mid">
            <MapPin className="w-3 h-3" />
            <span>{business.city}</span>
          </div>
          <button className="flex items-center gap-1 text-xs font-semibold text-verde hover:text-verde-mid transition-colors">
            {t(lang, "view_more")}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
