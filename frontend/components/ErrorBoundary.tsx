"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { ErrorDisplayProps } from "@/types";

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const { t } = useLanguage();

  if (!error) return null;

  return (
    <div className="animate-in">
      <div className="error-card">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="error-title">{t("errorTitle")}</p>
            <p className="error-message">{error.message}</p>
            <button type="button" onClick={onRetry} className="btn btn-secondary">
              {t("tryAgain")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
