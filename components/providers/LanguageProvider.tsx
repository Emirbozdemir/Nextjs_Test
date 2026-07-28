"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { LanguageCode, languages, translations } from "@/lib/languages";

type Value = { language: LanguageCode; setLanguage: (value: LanguageCode) => void; t: (key: string) => string };
const LanguageContext = createContext<Value | null>(null);
const storageKey = "adminpro-language";

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(storageKey) as LanguageCode | null;
    return saved && saved in languages ? saved : "en";
  });
  useEffect(() => { document.documentElement.lang = languages[language].locale; document.documentElement.dir = languages[language].direction; }, [language]);
  useEffect(() => {
    const handleLanguageChange = (event: Event) => setLanguageState((event as CustomEvent<LanguageCode>).detail);
    window.addEventListener("adminpro-language-change", handleLanguageChange);
    return () => window.removeEventListener("adminpro-language-change", handleLanguageChange);
  }, []);
  const setLanguage = (value: LanguageCode) => { window.localStorage.setItem(storageKey, value); setLanguageState(value); };
  return <LanguageContext.Provider value={{ language, setLanguage, t: (key) => translations[language][key] ?? translations.en[key] ?? key }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}
