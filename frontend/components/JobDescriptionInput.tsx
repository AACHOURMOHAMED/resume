"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { JobDescriptionInputProps } from "@/types";

export default function JobDescriptionInput({
  onAnalyze,
  onBack,
  initialValue = "",
  isLoading = false,
}: JobDescriptionInputProps) {
  const { t, isRTL } = useLanguage();
  const [jobText, setJobText] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const isValid = jobText.trim().length >= 30;

  const handleSubmit = () => {
    if (!isValid) {
      setError(t("jobMinLength"));
      return;
    }
    setError(null);
    onAnalyze(jobText.trim());
  };

  return (
    <div className="container-narrow animate-in">
      <div className="card card-lg">
        <h2 className="text-title mb-2">{t("jobTitle")}</h2>
        <p className="text-subtitle mb-8">{t("jobSubtitle")}</p>

        <div>
          <label
            htmlFor="jobText"
            className="block text-caption font-medium mb-3"
          >
            {t("jobLabel")}
          </label>
          <textarea
            id="jobText"
            value={jobText}
            onChange={(e) => {
              setJobText(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
            className={`textarea ${error ? "textarea-error" : ""}`}
            placeholder={t("jobPlaceholder")}
            dir={isRTL ? "rtl" : "ltr"}
            rows={10}
          />
          <div className="flex justify-between items-center mt-3">
            {error ? (
              <p className="text-small text-red-600">{error}</p>
            ) : (
              <span />
            )}
            <p className="text-caption">
              <span className={isValid ? "text-green-600 font-medium" : ""}>
                {jobText.length}
              </span>{" "}
              {t("charCount")} ({t("minRequired")})
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="btn btn-secondary"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("back")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="btn btn-primary btn-lg"
          >
            {isLoading && <div className="spinner" />}
            {isLoading ? t("analyzing") : t("analyze")}
          </button>
        </div>
      </div>
    </div>
  );
}
