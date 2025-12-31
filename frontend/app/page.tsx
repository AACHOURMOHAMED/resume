"use client";

import { useState } from "react";
import Stepper from "@/components/Stepper";
import ResumeInput from "@/components/ResumeInput";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import ErrorDisplay from "@/components/ErrorBoundary";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";
import { analyzeResume } from "@/lib/api";
import { Step, AnalysisResponse } from "@/types";

function MainContent() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState("");
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleResumeNext = (file: File) => {
    setResumeFile(file);
    setCurrentStep(2);
    setError(null);
  };

  const handleJobBack = () => {
    setCurrentStep(1);
    setError(null);
  };

  const handleAnalyze = async (text: string) => {
    if (!resumeFile) return;

    setJobText(text);
    setIsLoading(true);
    setError(null);

    try {
      const analysisResults = await analyzeResume({
        resumeFile,
        jobText: text,
      });

      setResults(analysisResults);
      setCurrentStep(3);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unexpected error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setResumeFile(null);
    setJobText("");
    setResults(null);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    if (currentStep === 2 && jobText && resumeFile) {
      handleAnalyze(jobText);
    }
  };

  return (
    <main className="min-h-screen py-12 lg:py-16">
      <div className="container-wide">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div />
            <LanguageSwitcher />
          </div>
          <div className="text-center">
            <h1 className="text-title mb-3">{t("appTitle")}</h1>
            <p className="text-subtitle max-w-md mx-auto">{t("appSubtitle")}</p>
          </div>
        </header>

        {/* Stepper */}
        <div className="mb-12">
          <Stepper currentStep={currentStep} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 container-narrow">
            <ErrorDisplay error={error} onRetry={handleRetry} />
          </div>
        )}

        {/* Steps */}
        {!error && (
          <>
            {currentStep === 1 && (
              <ResumeInput onNext={handleResumeNext} initialFile={resumeFile} />
            )}

            {currentStep === 2 && (
              <JobDescriptionInput
                onAnalyze={handleAnalyze}
                onBack={handleJobBack}
                initialValue={jobText}
                isLoading={isLoading}
              />
            )}

            {currentStep === 3 && results && (
              <ResultsDisplay results={results} onStartOver={handleStartOver} />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}
