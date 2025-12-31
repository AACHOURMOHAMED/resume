import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AnalyzeUploadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20000, { message: 'jobText is too long for analysis.' })
  jobText!: string;
}

