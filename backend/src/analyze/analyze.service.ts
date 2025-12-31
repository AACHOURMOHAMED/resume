import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { File as MulterFile } from 'multer';
import { AnalyzeRequestDto } from './dto/analyze-request.dto';
import { AnalyzeResponseDto } from './dto/analyze-response.dto';

@Injectable()
export class AnalyzeService {
  private static readonly MAX_TEXT_LENGTH = 20000;
  private readonly logger = new Logger(AnalyzeService.name);
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.model = this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o';
    this.client = apiKey ? new OpenAI({ apiKey }) : null;

    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY is not set. Falling back to offline response.',
      );
    }
  }

  /**
   * Performs a single OpenAI request to analyze resume vs job description.
   * Returns normalized JSON, or a safe fallback if anything fails.
   */
  async analyze(request: AnalyzeRequestDto): Promise<AnalyzeResponseDto> {
    const resumeText = request.resumeText.trim();
    const jobText = request.jobText.trim();

    this.logger.log(
      `[analyze] Input - resumeText length: ${resumeText.length}, jobText length: ${jobText.length}`,
    );

    if (!this.client) {
      this.logger.warn('[analyze] OpenAI client not available, using fallback');
      return this.buildFallback('OpenAI credentials are not configured.');
    }

    const prompt = this.buildPrompt(resumeText, jobText);
    this.logger.debug(`[analyze] Prompt length: ${prompt.length} chars`);
    this.logger.debug(`[analyze] Prompt preview (first 200 chars): ${prompt.substring(0, 200)}...`);

    try {
      this.logger.log(
        `[analyze] Calling OpenAI - model: ${this.model}, temperature: 0.2, max_tokens: 400`,
      );
      const completion = await this.client.chat.completions.create({
        model: this.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are an expert technical recruiter.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 400,
      });

      this.logger.log(
        `[analyze] OpenAI response received - choices: ${completion.choices?.length ?? 0}, finish_reason: ${completion.choices?.[0]?.finish_reason ?? 'unknown'}`,
      );

      const content = completion.choices[0]?.message?.content;
      this.logger.debug(
        `[analyze] Raw OpenAI content length: ${content?.length ?? 0}`,
      );
      if (content) {
        this.logger.debug(`[analyze] Raw content preview: ${content.substring(0, 300)}...`);
      } else {
        this.logger.warn('[analyze] OpenAI returned empty content');
      }

      const parsed = this.parseResponse(content);
      if (!parsed) {
        this.logger.warn('[analyze] OpenAI returned invalid JSON; using fallback.');
        return this.buildFallback('Model returned invalid JSON.');
      }

      this.logger.log(
        `[analyze] Successfully parsed - score: ${parsed.score}, pros: ${parsed.pros.length}, cons: ${parsed.cons.length}, tips: ${parsed.tips.length}`,
      );
      return parsed;
    } catch (error) {
      this.logger.error(
        '[analyze] OpenAI call failed; using fallback.',
        (error as Error)?.stack ?? String(error),
      );
      return this.buildFallback('Unable to complete analysis right now.');
    }
  }

  /**
   * Analyze using an uploaded file as the resume source.
   */
  async analyzeFromFile(
    file: MulterFile,
    jobText: string,
  ): Promise<AnalyzeResponseDto> {
    this.logger.log(
      `[analyzeFromFile] Starting - file: ${file.originalname}, size: ${file.size} bytes, mimetype: ${file.mimetype}, jobText length: ${jobText?.length ?? 0}`,
    );

    if (!file || !file.buffer) {
      this.logger.error('[analyzeFromFile] File or buffer missing');
      throw new BadRequestException('A resume file is required.');
    }

    if (!this.isSupportedMime(file.mimetype)) {
      this.logger.warn(`[analyzeFromFile] Unsupported mimetype: ${file.mimetype}`);
      throw new BadRequestException(
        'Unsupported file type. Please upload PDF or plain text.',
      );
    }

    const resumeText = await this.extractTextFromFile(file);
    this.logger.log(
      `[analyzeFromFile] Extracted text length: ${resumeText.length} chars`,
    );

    const safeResumeText = this.trimToLimit(resumeText);
    const safeJobText = this.trimToLimit(jobText);
    this.logger.log(
      `[analyzeFromFile] After trimming - resumeText: ${safeResumeText.length} chars, jobText: ${safeJobText.length} chars`,
    );

    return this.analyze({ resumeText: safeResumeText, jobText: safeJobText });
  }

  /**
   * Build the structured prompt instructing the model to respond with strict JSON.
   */
  private buildPrompt(resumeText: string, jobText: string): string {
    return [
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
  }

  /**
   * Parse and normalize the model response to the expected shape.
   */
  private parseResponse(content?: string | null): AnalyzeResponseDto | null {
    if (!content) {
      this.logger.warn('[parseResponse] Content is null or undefined');
      return null;
    }

    try {
      this.logger.debug(`[parseResponse] Attempting to parse JSON (${content.length} chars)`);
      const parsed = JSON.parse(content) as Partial<AnalyzeResponseDto>;
      this.logger.debug(
        `[parseResponse] Parsed JSON structure - has score: ${'score' in parsed}, has pros: ${Array.isArray(parsed.pros)}, has cons: ${Array.isArray(parsed.cons)}, has tips: ${Array.isArray(parsed.tips)}`,
      );
      this.logger.debug(
        `[parseResponse] Raw parsed values - score: ${parsed.score} (type: ${typeof parsed.score}), pros length: ${Array.isArray(parsed.pros) ? parsed.pros.length : 'not array'}, cons length: ${Array.isArray(parsed.cons) ? parsed.cons.length : 'not array'}, tips length: ${Array.isArray(parsed.tips) ? parsed.tips.length : 'not array'}`,
      );

      const normalized = {
        score: this.normalizeScore(parsed.score),
        pros: this.normalizeList(parsed.pros),
        cons: this.normalizeList(parsed.cons),
        tips: this.normalizeList(parsed.tips),
        weights: this.normalizeWeights(parsed.weights),
      };

      this.logger.debug(
        `[parseResponse] Normalized result - score: ${normalized.score}, pros: ${normalized.pros.length}, cons: ${normalized.cons.length}, tips: ${normalized.tips.length}`,
      );

      return normalized;
    } catch (error) {
      this.logger.warn(
        '[parseResponse] Failed to parse JSON from OpenAI response.',
        (error as Error)?.stack ?? String(error),
      );
      this.logger.debug(`[parseResponse] Failed content was: ${content.substring(0, 500)}`);
      return null;
    }
  }

  private normalizeScore(value: unknown): number {
    const originalType = typeof value;
    const asNumber =
      typeof value === 'number'
        ? value
        : typeof value === 'string' && value.trim() !== ''
          ? Number(value)
          : Number.NaN;

    if (Number.isNaN(asNumber)) {
      this.logger.warn(
        `[normalizeScore] Invalid score value: ${value} (type: ${originalType}), defaulting to 0`,
      );
      return 0;
    }

    const clamped = Math.max(0, Math.min(100, asNumber));
    const rounded = Math.round(clamped);
    if (rounded !== asNumber) {
      this.logger.debug(
        `[normalizeScore] Clamped score from ${asNumber} to ${rounded}`,
      );
    }
    return rounded;
  }

  private normalizeList(value: unknown): string[] {
    if (!Array.isArray(value)) {
      this.logger.warn(
        `[normalizeList] Value is not an array (type: ${typeof value}), returning empty array`,
      );
      return [];
    }

    const originalLength = value.length;
    const normalized = value
      .map((item) => (typeof item === 'string' ? item.trim() : null))
      .filter((item): item is string => Boolean(item));

    if (normalized.length !== originalLength) {
      this.logger.debug(
        `[normalizeList] Filtered array from ${originalLength} to ${normalized.length} items`,
      );
    }

    return normalized;
  }

  private normalizeWeights(value: unknown): AnalyzeResponseDto['weights'] {
    const fallback = { skills: 0, experience: 0, education: 0 };
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      value === null
    ) {
      this.logger.warn(
        `[normalizeWeights] Value is not an object; returning zeros (type: ${typeof value})`,
      );
      return fallback;
    }

    const asRecord = value as Record<string, unknown>;
    const normalizeNumber = (n: unknown, key: string): number => {
      const num =
        typeof n === 'number'
          ? n
          : typeof n === 'string' && n.trim() !== ''
            ? Number(n)
            : Number.NaN;
      if (Number.isNaN(num)) {
        this.logger.warn(`[normalizeWeights] Invalid number for ${key}, defaulting to 0`);
        return 0;
      }
      const clamped = Math.max(0, Math.min(100, num));
      const rounded = Math.round(clamped);
      if (rounded !== num) {
        this.logger.debug(`[normalizeWeights] Clamped ${key} from ${num} to ${rounded}`);
      }
      return rounded;
    };

    return {
      skills: normalizeNumber(asRecord.skills, 'skills'),
      experience: normalizeNumber(asRecord.experience, 'experience'),
      education: normalizeNumber(asRecord.education, 'education'),
    };
  }

  private buildFallback(reason: string): AnalyzeResponseDto {
    this.logger.warn(`[buildFallback] Creating fallback response - reason: ${reason}`);
    const fallback = {
      score: 0,
      pros: [],
      cons: ['Automatic fallback used.', reason].filter(Boolean),
      tips: [
        'Retry shortly or provide more detail in the resume and job description.',
      ],
      weights: { skills: 0, experience: 0, education: 0 },
    };
    this.logger.debug(
      `[buildFallback] Fallback response - score: ${fallback.score}, cons: ${fallback.cons.length}, tips: ${fallback.tips.length}`,
    );
    return fallback;
  }

  private async extractTextFromFile(file: MulterFile): Promise<string> {
    const mime = file.mimetype ?? '';
    this.logger.log(`[extractTextFromFile] Processing file - mimetype: ${mime}, buffer size: ${file.buffer?.length ?? 0} bytes`);

    if (mime.includes('pdf')) {
      try {
        this.logger.debug('[extractTextFromFile] Parsing PDF file');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pdfParseModule = require('pdf-parse');
        this.logger.debug(
          `[extractTextFromFile] pdf-parse module loaded - type: ${typeof pdfParseModule}, has PDFParse: ${typeof pdfParseModule.PDFParse}, has default: ${typeof pdfParseModule.default}`,
        );

        // Case 1: Class export (PDFParse)
        // In this pdf-parse version, PDFParse is a class that expects options, e.g. { data: Buffer }.
        // Text extraction is done via getText(), not parseBuffer().
        if (typeof pdfParseModule.PDFParse === 'function') {
          this.logger.debug('[extractTextFromFile] Using PDFParse class method');
          this.logger.debug(
            `[extractTextFromFile] Creating parser instance with { data }, buffer size: ${file.buffer.length} bytes`,
          );

          const parser = new pdfParseModule.PDFParse({ data: file.buffer });
          try {
            this.logger.debug('[extractTextFromFile] Calling getText()...');
            const result = await parser.getText();
            this.logger.debug(
              `[extractTextFromFile] getText() completed - result type: ${typeof result}, has text: ${typeof result?.text === 'string'}`,
            );
            if (result) {
              this.logger.debug(
                `[extractTextFromFile] Result keys: ${Object.keys(result).join(', ')}`,
              );
            }

            const extractedText =
              typeof result?.text === 'string' ? result.text : '';
            this.logger.log(
              `[extractTextFromFile] PDF parsed successfully (class) - extracted text length: ${extractedText.length} chars`,
            );
            if (extractedText.length > 0) {
              this.logger.debug(
                `[extractTextFromFile] Text preview (first 200 chars): ${extractedText.substring(0, 200)}...`,
              );
            }
            return extractedText;
          } finally {
            // Ensure underlying PDF.js resources are released.
            await parser.destroy().catch(() => undefined);
          }
        }

        // Case 2: Function export (default or module itself)
        this.logger.debug('[extractTextFromFile] Checking for function export');
        const pdfParseFn =
          typeof pdfParseModule === 'function'
            ? pdfParseModule
            : typeof pdfParseModule.default === 'function'
              ? pdfParseModule.default
              : null;

        if (pdfParseFn) {
          this.logger.debug(
            `[extractTextFromFile] Using function export - type: ${typeof pdfParseFn}`,
          );
          this.logger.debug(
            `[extractTextFromFile] Calling pdfParse function, buffer size: ${file.buffer.length} bytes`,
          );
          const result = await pdfParseFn(file.buffer);
          this.logger.debug(
            `[extractTextFromFile] Function call completed - result type: ${typeof result}, has text: ${typeof result?.text === 'string'}`,
          );
          if (result) {
            this.logger.debug(
              `[extractTextFromFile] Result keys: ${Object.keys(result).join(', ')}`,
            );
          }
          const extractedText = typeof result?.text === 'string' ? result.text : '';
          this.logger.log(
            `[extractTextFromFile] PDF parsed successfully (fn) - extracted text length: ${extractedText.length} chars`,
          );
          if (extractedText.length > 0) {
            this.logger.debug(
              `[extractTextFromFile] Text preview (first 200 chars): ${extractedText.substring(0, 200)}...`,
            );
          }
          return extractedText;
        }

        this.logger.error(
          `[extractTextFromFile] pdf-parse export not callable. Module type: ${typeof pdfParseModule}, Keys: ${Object.keys(pdfParseModule).join(', ')}`,
        );
        throw new Error('pdf-parse callable export not found');
      } catch (error) {
        this.logger.error(
          '[extractTextFromFile] Failed to parse PDF; falling back to empty text.',
        );
        this.logger.error(
          `[extractTextFromFile] Error type: ${(error as Error)?.constructor?.name ?? typeof error}, message: ${(error as Error)?.message ?? String(error)}`,
        );
        this.logger.debug(
          `[extractTextFromFile] Error stack: ${(error as Error)?.stack ?? 'No stack trace'}`,
        );
        return '';
      }
    }

    // Treat as UTF-8 text by default.
    this.logger.debug('[extractTextFromFile] Treating as plain text file');
    const text = file.buffer.toString('utf8');
    this.logger.log(
      `[extractTextFromFile] Text extracted - length: ${text.length} chars`,
    );
    return text;
  }

  private trimToLimit(text: string): string {
    if (!text) {
      return '';
    }
    const normalized = text.trim();
    if (normalized.length <= AnalyzeService.MAX_TEXT_LENGTH) {
      return normalized;
    }
    return normalized.slice(0, AnalyzeService.MAX_TEXT_LENGTH);
  }

  private isSupportedMime(mime: string | undefined): boolean {
    if (!mime) {
      return false;
    }
    return mime.includes('pdf') || mime.includes('text');
  }
}

