import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLang } from "@/lib/LangContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Login() {
  const { lang, setLang } = useLang();
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/minha-conta";
  const isCadastroFlow = redirectTo === "/cadastrar";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    if (mode === "login") {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(lang === "pt" ? "E-mail ou senha incorretos." : "Incorrect email or password.");
      } else {
        navigate(redirectTo);
      }
    } else {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setError(lang === "pt" ? "Erro ao criar conta. Tente novamente." : "Error creating account. Please try again.");
      } else {
        setSuccess(lang === "pt"
          ? "Conta criada! Verifique seu e-mail para confirmar."
          : "Account created! Check your email to confirm.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar lang={lang} onLangChange={setLang} />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-verde flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm leading-none">BR</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                BR<span className="text-verde">Conect</span>
              </span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-foreground">
              {mode === "login"
                ? (lang === "pt" ? "Entrar na sua conta" : "Sign in to your account")
                : (lang === "pt" ? "Criar sua conta" : "Create your account")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isCadastroFlow
                ? (lang === "pt"
                    ? "Entre ou crie sua conta para cadastrar seu negócio 🏪"
                    : "Sign in or create your account to list your business 🏪")
                : (lang === "pt"
                    ? "Gerencie seus negócios no BRConect"
                    : "Manage your businesses on BRConect")}
            </p>
          </div>

          {isCadastroFlow && (
            <div className="bg-verde-light border border-verde/20 rounded-2xl px-5 py-4 mb-5 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🚀</span>
              <div>
                <p className="text-sm font-bold text-verde mb-0.5">
                  {lang === "pt"
                    ? "Quase lá! É rapidinho, promessa. 😄"
                    : "Almost there! Super quick, we promise. 😄"}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === "pt"
                    ? "Para vincular o negócio à sua conta e poder editar quando quiser, precisamos só de um login rápido. Menos de 1 minuto e seu negócio já está no ar! 🎉"
                    : "To link your business to your account and edit anytime, we just need a quick login. Less than 1 minute and your business is live! 🎉"}
                </p>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            {/* Errors / Success */}
            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-xl px-4 py-3 text-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="bg-verde-light text-verde rounded-xl px-4 py-3 text-sm mb-4">
                {success}
              </div>
            )}

            {/* Email form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="seu@email.com" className="input-search w-full pl-10" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••" className="input-search w-full pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
                {loading ? "..." : mode === "login"
                  ? (lang === "pt" ? "Entrar" : "Sign in")
                  : (lang === "pt" ? "Criar conta" : "Create account")}
              </button>
            </form>

            {/* Toggle mode */}
            <p className="text-center text-sm text-muted-foreground mt-4">
              {mode === "login"
                ? (lang === "pt" ? "Não tem conta? " : "No account? ")
                : (lang === "pt" ? "Já tem conta? " : "Already have an account? ")}
              <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
                className="text-verde font-semibold hover:underline">
                {mode === "login"
                  ? (lang === "pt" ? "Criar agora" : "Create now")
                  : (lang === "pt" ? "Entrar" : "Sign in")}
              </button>
            </p>
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
