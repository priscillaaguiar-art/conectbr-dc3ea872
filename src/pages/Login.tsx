import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLang } from "@/lib/LangContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Login() {
  const { lang, setLang } = useLang();
  const { signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

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
        navigate("/minha-conta");
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
              {lang === "pt" ? "Gerencie seus negócios no BRConect" : "Manage your businesses on BRConect"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            {/* OAuth buttons */}
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2 border border-border rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors mb-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {lang === "pt" ? "Continuar com Google" : "Continue with Google"}
            </button>

            <button
              onClick={signInWithFacebook}
              className="w-full flex items-center justify-center gap-2 border border-border rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              {lang === "pt" ? "Continuar com Facebook" : "Continue with Facebook"}
            </button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">{lang === "pt" ? "ou com e-mail" : "or with email"}</span>
              </div>
            </div>

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
