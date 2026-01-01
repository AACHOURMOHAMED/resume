import { AnalyzeResponseDto } from '../dto/analyze-response.dto';

type Weights = AnalyzeResponseDto['weights'];

export const buildPrompt = (resumeText: string, jobText: string): string =>
  [
    'You are an expert technical recruiter.',
    'Compare the resume and job description below.',
    '',
    'Return ONLY valid JSON in this exact format:',
    '{',
    '  "score": number,',
    '  "pros": string[],',
    '  "cons": string[],',
    '  "tips": string[],',
    '  "weights": {',
    '    "skills": number,',
    '    "experience": number,',
    '    "education": number',
    '  }',
    '}',
    '',
    'Rules:',
    '- score: 0-100 match.',
    '- pros/cons: concise bullet strings.',
    '- tips: actionable next steps.',
    '- weights: percentage contributions (0-100) for skills, experience, education; they should sum near 100.',
    '',
    'Resume:',
    resumeText,
    '',
    'Job Description:',
    jobText,
  ].join('\n');


export const normalizeScore = (value: unknown): number => {
  const num =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : Number.NaN;
  if (Number.isNaN(num)) {
    return 0;
  }
  const clamped = Math.max(0, Math.min(100, num));
  return Math.round(clamped);
};

export const normalizeList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : null))
    .filter((item): item is string => Boolean(item));
};

export const normalizeWeights = (value: unknown): Weights => {
  const fallback: Weights = { skills: 0, experience: 0, education: 0 };
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    value === null
  ) {
    return fallback;
  }

  const asRecord = value as Record<string, unknown>;
  const toNumber = (input: unknown): number => {
    const num =
      typeof input === 'number'
        ? input
        : typeof input === 'string' && input.trim() !== ''
          ? Number(input)
          : Number.NaN;
    if (Number.isNaN(num)) {
      return 0;
    }
    const clamped = Math.max(0, Math.min(100, num));
    return Math.round(clamped);
  };

  return {
    skills: toNumber(asRecord.skills),
    experience: toNumber(asRecord.experience),
    education: toNumber(asRecord.education),
  };
};

export const buildFallback = (reason: string): AnalyzeResponseDto => ({
  score: 0,
  pros: [],
  cons: ['Automatic fallback used.', reason].filter(Boolean),
  tips: ['Retry shortly or provide more detail in the resume and job description.'],
  weights: { skills: 0, experience: 0, education: 0 },
});

