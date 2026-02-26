import { useState } from "react";
import { Link } from "react-router-dom";
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
    <footer className="bg-dark text-white">
      {/* Feedback section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-lg">
            <h3 className="font-display font-bold text-xl text-white mb-2">
              {lang === "pt" ? "Envie uma sugestão" : "Send a suggestion"}
            </h3>
            <p className="text-sm text-white/50 mb-8">{t(lang, "footer_feedback")}</p>

            {sent ? (
              <div className="bg-amarelo/20 border border-amarelo/30 rounded-2xl px-6 py-5">
                <p className="text-amarelo font-medium text-sm">
                  {lang === "pt"
                    ? "Obrigado pela sua sugestão! Vamos analisar com carinho. 💛"
                    : "Thank you for your suggestion! We'll review it carefully. 💛"}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "pt" ? "Seu nome (opcional)" : "Your name (optional)"}
                  className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amarelo/60 transition-colors"
                  maxLength={100}
                />
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    placeholder={lang === "pt" ? "Seu e-mail *" : "Your email *"}
                    className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none transition-colors ${emailError ? "border-red-500" : "border-white/15 focus:border-amarelo/60"}`}
                    maxLength={255}
                  />
                  {emailError && <p className="text-red-400 text-xs mt-1.5">{emailError}</p>}
                </div>
                <div>
                  <textarea
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setMessageError(""); }}
                    placeholder={lang === "pt" ? "Sua mensagem *" : "Your message *"}
                    rows={3}
                    className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none transition-colors resize-none ${messageError ? "border-red-500" : "border-white/15 focus:border-amarelo/60"}`}
                    maxLength={1000}
                  />
                  {messageError && <p className="text-red-400 text-xs mt-1.5">{messageError}</p>}
                </div>
                <button
                  onClick={handleSend}
                  disabled={insertFeedback.isPending}
                  className="btn-accent py-3 px-6 text-sm flex items-center gap-2 self-start disabled:opacity-60"
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
      </div>

      {/* Footer links */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-verde flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">BR</span>
              </div>
              <span className="font-display font-bold text-xl">
                BR<span className="text-amarelo">Conect</span>
              </span>
            </div>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">{t(lang, "footer_tagline")}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm text-white/80 mb-4 uppercase tracking-wider">
              {lang === "pt" ? "Plataforma" : "Platform"}
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm text-white/50">
              <Link to="/busca" className="hover:text-amarelo transition-colors w-fit">
                {lang === "pt" ? "Buscar negócios" : "Search businesses"}
              </Link>
              <Link to="/cadastrar" className="hover:text-amarelo transition-colors w-fit">
                {lang === "pt" ? "Cadastrar negócio" : "List business"}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm text-white/80 mb-4 uppercase tracking-wider">
              {lang === "pt" ? "Legal" : "Legal"}
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm text-white/50">
              <Link to="/privacidade" className="hover:text-amarelo transition-colors w-fit">
                {t(lang, "footer_privacy")}
              </Link>
              <a href="#" className="hover:text-amarelo transition-colors w-fit">
                {t(lang, "footer_terms")}
              </a>
              <a href="#" className="hover:text-amarelo transition-colors w-fit">
                {t(lang, "footer_contact")}
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          {t(lang, "footer_rights")}
        </div>
      </div>
    </footer>
  );
}
