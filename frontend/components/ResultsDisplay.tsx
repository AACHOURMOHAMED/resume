"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { ResultsDisplayProps } from "@/types";
import WeightsDisplay from "./WeightsDisplay";

export default function ResultsDisplay({
  results,
  onStartOver,
}: ResultsDisplayProps) {
  const { t } = useLanguage();
  const { score, pros, cons, tips, weights } = results;

  const getScoreClass = () => {
    if (score >= 70) return "success";
    if (score >= 40) return "warning";
    return "danger";
  };

  const getScoreLabel = () => {
    if (score >= 70) return t("greatMatch");
    if (score >= 40) return t("moderateMatch");
    return t("needsImprovement");
  };

  return (
    <div className="container-wide animate-in">
      <div className="card card-lg">
        <h2 className="text-title mb-8 text-center">{t("resultsTitle")}</h2>

        {/* Score */}
        <div className="text-center mb-10">
          <div className={`score-badge ${getScoreClass()} mx-auto mb-4`}>
            {score}
          </div>
          <p className="text-body font-semibold text-lg">{getScoreLabel()}</p>
          <p className="text-caption">{t("outOf100")}</p>
        </div>

        {/* Weights */}
        {weights && <WeightsDisplay weights={weights} />}

        {/* Results Grid */}
        <div className="results-grid mb-6">
          {/* Strengths */}
          <div className="results-section success">
            <h3 className="results-section-title success">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M22 11.08V12a10 10 0 11-5.93-9.14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 4L12 14.01l-3-3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("strengths")}
            </h3>
            {pros.length > 0 ? (
              <ul>
                {pros.map((pro, i) => (
                  <li key={i} className="results-item">
                    {pro}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-caption">{t("noStrengths")}</p>
            )}
          </div>

          {/* Gaps */}
          <div className="results-section danger">
            <h3 className="results-section-title danger">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="12"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="16"
                  x2="12.01"
                  y2="16"
                  strokeLinecap="round"
                />
              </svg>
              {t("gaps")}
            </h3>
            {cons.length > 0 ? (
              <ul>
                {cons.map((con, i) => (
                  <li key={i} className="results-item">
                    {con}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-caption">{t("noGaps")}</p>
            )}
          </div>
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="results-section info mb-8">
            <h3 className="results-section-title info">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="17"
                  x2="12.01"
                  y2="17"
                  strokeLinecap="round"
                />
              </svg>
              {t("tips")}
            </h3>
            <ul>
              {tips.map((tip, i) => (
                <li key={i} className="results-item">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Start Over */}
        <div className="flex justify-center">
          <button type="button" onClick={onStartOver} className="btn btn-secondary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M1 4v6h6M23 20v-6h-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("startOver")}
          </button>
        </div>
      </div>
    </div>
  );
}
