import { useState } from "react";
import { Send } from "lucide-react";
import { Lang, t } from "@/lib/i18n";
import { useInsertFeedback } from "@/hooks/use-businesses";

interface FooterProps {
  lang: Lang;
}

export function Footer({ lang }: FooterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [sent, setSent] = useState(false);
  const insertFeedback = useInsertFeedback();

  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSend = async () => {
    let valid = true;
    setEmailError("");
    setMessageError("");

    if (!email.trim() || !validateEmail(email.trim())) {
      setEmailError(lang === "pt" ? "Por favor, insira um e-mail válido." : "Please enter a valid email.");
      valid = false;
    }
    if (!message.trim()) {
      setMessageError(lang === "pt" ? "A mensagem é obrigatória." : "Message is required.");
      valid = false;
    }
    if (!valid) return;

    try {
      await insertFeedback.mutateAsync({
        name: name.trim() || null,
        email: email.trim(),
        message: message.trim(),
      });
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error("Error sending feedback:", err);
    }
  };

  return (
    <footer className="bg-foreground text-primary-foreground mt-20">
      {/* Feedback section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-12">
          <h3 className="font-display font-bold text-lg text-primary-foreground mb-1">
            {lang === "pt" ? "Envie uma sugestão" : "Send a suggestion"}
          </h3>
          <p className="text-sm text-primary-foreground/60 mb-6">{t(lang, "footer_feedback")}</p>

          {sent ? (
            <div className="bg-accent/20 border border-accent/30 rounded-xl px-6 py-4 max-w-lg">
              <p className="text-accent font-medium text-sm">
                {lang === "pt"
                  ? "Obrigado pela sua sugestão! Vamos analisar com carinho. 💛"
                  : "Thank you for your suggestion! We'll review it carefully. 💛"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-lg">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === "pt" ? "Seu nome (opcional)" : "Your name (optional)"}
                className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-accent/60 transition-colors"
                maxLength={100}
              />
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  placeholder={lang === "pt" ? "Seu e-mail *" : "Your email *"}
                  className={`w-full bg-primary-foreground/10 border rounded-xl px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none transition-colors ${emailError ? "border-destructive" : "border-primary-foreground/20 focus:border-accent/60"}`}
                  maxLength={255}
                />
                {emailError && <p className="text-destructive text-xs mt-1">{emailError}</p>}
              </div>
              <div>
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setMessageError(""); }}
                  placeholder={lang === "pt" ? "Sua mensagem *" : "Your message *"}
                  rows={3}
                  className={`w-full bg-primary-foreground/10 border rounded-xl px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none transition-colors resize-none ${messageError ? "border-destructive" : "border-primary-foreground/20 focus:border-accent/60"}`}
                  maxLength={1000}
                />
                {messageError && <p className="text-destructive text-xs mt-1">{messageError}</p>}
              </div>
              <button
                onClick={handleSend}
                disabled={insertFeedback.isPending}
                className="btn-accent py-2.5 px-6 text-sm flex items-center gap-2 self-start disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {insertFeedback.isPending
                  ? (lang === "pt" ? "Enviando..." : "Sending...")
                  : t(lang, "footer_send")}
              </button>
            </div>
          )}
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
