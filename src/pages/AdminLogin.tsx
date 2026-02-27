import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLang } from "@/lib/LangContext";

export default function AdminLogin() {
  const { lang } = useLang();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(
        lang === "pt"
          ? "E-mail ou senha incorretos. Tente novamente."
          : "Incorrect email or password. Please try again."
      );
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-verde flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-dark">
            {lang === "pt" ? "Acesso Admin" : "Admin Access"}
          </h1>
          <p className="text-sm text-mid mt-1">BRConect — backoffice</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white border border-border rounded-2xl p-6 shadow-card space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">
              {lang === "pt" ? "E-mail" : "Email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-mid" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@brconect.ca"
                className="input-search w-full pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">
              {lang === "pt" ? "Senha" : "Password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-mid" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-search w-full pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-mid hover:text-dark transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading
              ? lang === "pt" ? "Entrando..." : "Signing in..."
              : lang === "pt" ? "Entrar" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-mid mt-6">
          {lang === "pt"
            ? "Acesso restrito à equipe BRConect."
            : "Access restricted to BRConect team."}
        </p>
      </div>
    </div>
  );
}
