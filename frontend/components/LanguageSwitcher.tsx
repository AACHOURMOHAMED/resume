"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-switch">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={language === "en" ? "active" : ""}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ar")}
        className={language === "ar" ? "active" : ""}
      >
        عربي
      </button>
    </div>
  );
}
