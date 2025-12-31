import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { File as MulterFile } from 'multer';
import { AnalyzeService } from './analyze.service';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { AnalyzeResponseDto } from './dto/analyze-response.dto';
import { AnalyzeUploadDto } from './dto/analyze-upload.dto';

@Controller('analyze')
export class AnalyzeController {
  private static readonly MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2MB
  private readonly logger = new Logger(AnalyzeController.name);

  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async analyze(@Body() payload: AnalyzeRequestDto): Promise<AnalyzeResponseDto> {
    this.logger.log(
      `[POST /api/analyze] Request received - resumeText length: ${payload.resumeText?.length ?? 0}, jobText length: ${payload.jobText?.length ?? 0}`,
    );
    const result = await this.analyzeService.analyze(payload);
    this.logger.log(
      `[POST /api/analyze] Response - score: ${result.score}, pros: ${result.pros.length}, cons: ${result.cons.length}, tips: ${result.tips.length}`,
    );
    return result;
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: AnalyzeController.MAX_UPLOAD_BYTES },
    }),
  )
  async analyzeUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: AnalyzeController.MAX_UPLOAD_BYTES,
            message: 'File too large. Max 2MB.',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: MulterFile,
    @Body() payload: AnalyzeUploadDto,
  ): Promise<AnalyzeResponseDto> {
    this.logger.log(
      `[POST /api/analyze/upload] Request received - file: ${file.originalname}, size: ${file.size} bytes, mimetype: ${file.mimetype}, jobText length: ${payload.jobText?.length ?? 0}`,
    );
    const result = await this.analyzeService.analyzeFromFile(file, payload.jobText);
    this.logger.log(
      `[POST /api/analyze/upload] Response - score: ${result.score}, pros: ${result.pros.length}, cons: ${result.cons.length}, tips: ${result.tips.length}`,
    );
    return result;
  }
}

