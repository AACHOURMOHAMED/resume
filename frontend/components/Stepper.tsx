"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { StepperProps } from "@/types";

export default function Stepper({ currentStep }: StepperProps) {
  const { t } = useLanguage();

  const steps = [
    { number: 1, label: t("step1") },
    { number: 2, label: t("step2") },
    { number: 3, label: t("step3") },
  ];

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div key={step.number} className="stepper-item">
          <div className="flex flex-col items-center">
            <div
              className={`stepper-circle ${
                currentStep > step.number
                  ? "completed"
                  : currentStep === step.number
                  ? "active"
                  : "inactive"
              }`}
            >
              {currentStep > step.number ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span
              className={`stepper-label ${
                currentStep >= step.number ? "active" : ""
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`stepper-line ${
                currentStep > step.number ? "completed" : ""
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
