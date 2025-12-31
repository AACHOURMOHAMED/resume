// API Request/Response Types
export interface AnalysisRequest {
  resumeFile: File;
  jobText: string;
}

export interface AnalysisResponse {
  score: number;
  pros: string[];
  cons: string[];
  tips: string[];
  weights?: {
    skills: number;
    experience: number;
    education: number;
  };
}

// Step Management
export type Step = 1 | 2 | 3;

// Component Props
export interface StepperProps {
  currentStep: Step;
}

export interface ResumeInputProps {
  onNext: (file: File) => void;
  initialFile?: File | null;
}

export interface JobDescriptionInputProps {
  onAnalyze: (jobText: string) => void;
  onBack: () => void;
  initialValue?: string;
  isLoading?: boolean;
}

export interface ResultsDisplayProps {
  results: AnalysisResponse;
  onStartOver: () => void;
}

export interface ErrorDisplayProps {
  error: Error | null;
  onRetry: () => void;
}
