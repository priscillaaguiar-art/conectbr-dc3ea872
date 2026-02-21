import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, MessageCircle, Instagram, Phone, Mail, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lang, t } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/data";
import { useBusinessById } from "@/hooks/use-businesses";

export default function BusinessDetail() {
  const [lang, setLang] = useState<Lang>("pt");
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: business, isLoading } = useBusinessById(id);
  const cat = business ? CATEGORIES.find((c) => c.key === business.category) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar lang={lang} onLangChange={setLang} />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {lang === "pt" ? "Carregando..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar lang={lang} onLangChange={setLang} />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {lang === "pt" ? "Negócio não encontrado." : "Business not found."}
        </div>
      </div>
    );
  }

  const initials = business.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const description = lang === "en" && business.description_en ? business.description_en : business.description;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="container mx-auto px-4 py-8 max-w-3xl flex-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(lang, "back_results")}
        </button>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card mb-6">
          <div className="h-40 gradient-hero relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <span className="font-display font-bold text-3xl text-primary-foreground">{initials}</span>
            </div>
            {business.type === "company" && (
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary-foreground/20 rounded-xl text-primary-foreground text-xs font-semibold backdrop-blur-sm">
                {lang === "pt" ? "Empresa" : "Company"}
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start gap-3 flex-wrap mb-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-foreground mb-1">{business.name}</h1>
                {cat && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-primary-muted text-primary">
                    {cat.emoji} {t(lang, cat.labelKey as any)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{business.city}, Ontario, Canada</span>
            </div>

            <div className="mb-6">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t(lang, "description")}
              </h2>
              <p className="text-foreground leading-relaxed">{description}</p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                {t(lang, "contact")}
              </h2>
              <div className="flex flex-wrap gap-3">
                {business.whatsapp && (
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[hsl(142,60%,94%)] text-[hsl(142,60%,28%)] border border-[hsl(142,40%,85%)] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[hsl(142,60%,88%)] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t(lang, "whatsapp")}
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                )}
                {business.instagram && (
                  <a
                    href={`https://instagram.com/${business.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-pink-50 text-pink-700 border border-pink-100 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-pink-100 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    @{business.instagram.replace("@", "")}
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                )}
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {business.phone}
                  </a>
                )}
                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex items-center gap-2 bg-muted text-muted-foreground border border-border rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-muted/80 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {business.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-accent-muted border border-accent/20 rounded-2xl p-5 flex items-center gap-4">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="font-semibold text-sm text-foreground">
              {lang === "pt" ? "Perfil verificado em breve" : "Verified profile coming soon"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "pt"
                ? "Avaliações e selo verificado estarão disponíveis na próxima versão."
                : "Reviews and verified badge will be available in the next version."}
            </p>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
