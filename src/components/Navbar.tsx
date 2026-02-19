import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, Plus, LogIn, ChevronDown } from "lucide-react";
import { Lang } from "@/lib/i18n";

interface NavbarProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

export function Navbar({ lang, onLangChange }: NavbarProps) {
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-primary">
            <span className="text-primary-foreground font-display font-bold text-sm leading-none">BR</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            BR<span className="text-primary">Conect</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{lang}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-card overflow-hidden z-50 min-w-[100px]">
                {(["pt", "en"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { onLangChange(l); setLangOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted ${lang === l ? "text-primary bg-primary-muted" : "text-foreground"}`}
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
            className="hidden sm:flex items-center gap-1.5 btn-accent text-sm py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === "pt" ? "Cadastrar negócio" : "List business"}</span>
          </button>

          {/* Login */}
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === "pt" ? "Admin" : "Admin"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
