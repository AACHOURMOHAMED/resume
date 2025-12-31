export class AnalyzeResponseDto {
  score!: number;
  pros!: string[];
  cons!: string[];
  tips!: string[];
  weights!: {
    skills: number;
    experience: number;
    education: number;
  };
}

