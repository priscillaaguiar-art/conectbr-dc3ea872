import { Lang, t } from "@/lib/i18n";

interface Props { lang: Lang }

export function AboutSection({ lang }: Props) {
  return (
    <section className="py-24 px-4 bg-accent-muted">
      <div className="container mx-auto max-w-3xl">
        {/* Decorative accent line */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-1 w-12 rounded-full bg-accent" />
        </div>

        <h2 className="section-title text-center text-primary text-3xl md:text-4xl mb-8 animate-fade-up">
          {t(lang, "about_title")}
        </h2>

        <div className="space-y-5 text-center animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-foreground text-lg md:text-xl font-medium leading-relaxed">
            {t(lang, "about_p1")}
          </p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {t(lang, "about_p2")}
          </p>
        </div>
      </div>
    </section>
  );
}
