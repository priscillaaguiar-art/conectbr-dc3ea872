import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Lang } from "@/lib/i18n";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: "pt",
  setLang: () => {},
});

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem("brconect_lang");
    if (stored === "pt" || stored === "en") return stored;
  } catch {}
  return "pt";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("brconect_lang", l);
    } catch {}
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
