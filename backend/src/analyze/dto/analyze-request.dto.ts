import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AnalyzeRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20000, { message: 'resumeText is too long for analysis.' })
  resumeText!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20000, { message: 'jobText is too long for analysis.' })
  jobText!: string;
}

