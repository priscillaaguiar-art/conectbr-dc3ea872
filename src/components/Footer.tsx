import { useState } from "react";
import { Send } from "lucide-react";
import { Lang, t } from "@/lib/i18n";
import { useInsertFeedback } from "@/hooks/use-businesses";

interface FooterProps {
  lang: Lang;
}

export function Footer({ lang }: FooterProps) {
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);
  const insertFeedback = useInsertFeedback();

  const handleSend = async () => {
    if (feedback.trim()) {
      try {
        await insertFeedback.mutateAsync(feedback.trim());
        setSent(true);
        setFeedback("");
        setTimeout(() => setSent(false), 3000);
      } catch (err) {
        console.error("Error sending feedback:", err);
      }
    }
  };

  return (
    <footer className="bg-foreground text-primary-foreground mt-16">
      {/* Feedback section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-10">
          <p className="text-sm text-primary-foreground/60 mb-3">{t(lang, "footer_feedback")}</p>
          <div className="flex gap-3 max-w-lg">
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t(lang, "footer_feedback")}
              className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-accent/60 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="btn-accent py-2.5 px-4 text-sm flex items-center gap-2">
              <Send className="w-4 h-4" />
              {sent ? "✓" : t(lang, "footer_send")}
            </button>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xs">BR</span>
              </div>
              <span className="font-display font-bold text-lg">
                BR<span className="text-accent">Conect</span>
              </span>
            </div>
            <p className="text-xs text-primary-foreground/50 max-w-xs">{t(lang, "footer_tagline")}</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/60">
            {[
              { key: "footer_about", href: "#" },
              { key: "footer_contact", href: "#" },
              { key: "footer_terms", href: "#" },
              { key: "footer_privacy", href: "#" },
            ].map(({ key, href }) => (
              <a key={key} href={href} className="hover:text-accent transition-colors">
                {t(lang, key as any)}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
          {t(lang, "footer_rights")}
        </div>
      </div>
    </footer>
  );
}
