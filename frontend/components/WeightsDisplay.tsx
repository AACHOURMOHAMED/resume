"use client";

import { useLanguage } from "@/lib/LanguageContext";

interface WeightsDisplayProps {
  weights: {
    skills: number;
    experience: number;
    education: number;
  };
}

export default function WeightsDisplay({ weights }: WeightsDisplayProps) {
  const { t, isRTL } = useLanguage();
  const { skills, experience, education } = weights;

  const items = [
    { label: t("skills"), value: skills, color: "bg-zinc-800" },
    { label: t("experience"), value: experience, color: "bg-zinc-700" },
    { label: t("education"), value: education, color: "bg-zinc-600" },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-body font-semibold mb-4">{t("weightsTitle")}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-caption font-medium">{item.label}</span>
              <span className="text-caption font-semibold">{item.value}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all duration-500`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

