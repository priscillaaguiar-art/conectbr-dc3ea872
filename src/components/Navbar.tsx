import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Globe, Plus, LogIn, ChevronDown, Menu, X, User } from "lucide-react";
import { Lang } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";

interface NavbarProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

export function Navbar({ lang, onLangChange }: NavbarProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const langRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-verde flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm leading-none">BR</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-dark">
            BR<span className="text-verde">Conect</span>
          </span>
        </Link>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Language toggle */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-mid hover:text-dark hover:border-verde/30 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{lang}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-card overflow-hidden z-50 min-w-[100px]">
                {(["pt", "en"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { onLangChange(l); setLangOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-verde-muted ${lang === l ? "text-verde bg-verde-light" : "text-dark"}`}
                  >
                    {l === "pt" ? "🇧🇷 Português" : "🇨🇦 English"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Register button */}
          <button
            onClick={() => navigate("/cadastrar")}
            className="flex items-center gap-1.5 btn-accent text-sm py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === "pt" ? "Cadastrar negócio" : "List business"}</span>
          </button>

          {/* User login / account */}
          {user ? (
            <button
              onClick={() => navigate("/minha-conta")}
              className="flex items-center gap-1.5 btn-outline text-sm py-2 px-4"
            >
              <div className="w-5 h-5 rounded-full bg-verde flex items-center justify-center">
                <span className="text-white text-xs font-bold">{(user.email || "U")[0].toUpperCase()}</span>
              </div>
              <span>{lang === "pt" ? "Minha conta" : "My account"}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 btn-outline text-sm py-2 px-4"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}

        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl text-dark hover:bg-verde-muted transition-colors"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-white px-4 py-4 space-y-3 animate-fade-in">
          <div className="flex gap-2">
            {(["pt", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => { onLangChange(l); setMobileOpen(false); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${lang === l ? "bg-verde text-white" : "bg-verde-muted text-dark"}`}
              >
                {l === "pt" ? "🇧🇷 PT" : "🇨🇦 EN"}
              </button>
            ))}
          </div>

          <button
            onClick={() => { navigate("/cadastrar"); setMobileOpen(false); }}
            className="w-full flex items-center justify-center gap-2 btn-accent text-sm py-3"
          >
            <Plus className="w-4 h-4" />
            {lang === "pt" ? "Cadastrar negócio" : "List business"}
          </button>

          {user ? (
            <button
              onClick={() => { navigate("/minha-conta"); setMobileOpen(false); }}
              className="w-full flex items-center justify-center gap-2 btn-outline text-sm py-3"
            >
              <User className="w-4 h-4" />
              {lang === "pt" ? "Minha conta" : "My account"}
            </button>
          ) : (
            <button
              onClick={() => { navigate("/login"); setMobileOpen(false); }}
              className="w-full flex items-center justify-center gap-2 btn-outline text-sm py-3"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}

        </div>
      )}
    </header>
  );
}
