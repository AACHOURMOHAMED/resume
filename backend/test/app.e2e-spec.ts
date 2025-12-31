import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AnalyzeController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/api/analyze (POST) returns structured analysis (fallback safe)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/analyze')
      .send({
        resumeText: 'Backend engineer with NestJS experience.',
        jobText: 'Looking for a backend engineer experienced with TypeScript.',
      })
      .expect(200);

    expect(typeof response.body.score).toBe('number');
    expect(Array.isArray(response.body.pros)).toBe(true);
    expect(Array.isArray(response.body.cons)).toBe(true);
    expect(Array.isArray(response.body.tips)).toBe(true);
    expect(typeof response.body.weights).toBe('object');
    expect(typeof response.body.weights.skills).toBe('number');
    expect(typeof response.body.weights.experience).toBe('number');
    expect(typeof response.body.weights.education).toBe('number');
  });

  it('/api/analyze/upload (POST) accepts text upload and returns analysis', async () => {
    const resumeBuffer = Buffer.from(
      'Experienced backend engineer with NestJS and TypeScript.',
      'utf8',
    );

    const response = await request(app.getHttpServer())
      .post('/api/analyze/upload')
      .field('jobText', 'Looking for a backend engineer with NestJS.')
      .attach('file', resumeBuffer, {
        filename: 'resume.txt',
        contentType: 'text/plain',
      })
      .expect(200);

    expect(typeof response.body.score).toBe('number');
    expect(Array.isArray(response.body.pros)).toBe(true);
    expect(Array.isArray(response.body.cons)).toBe(true);
    expect(Array.isArray(response.body.tips)).toBe(true);
    expect(typeof response.body.weights).toBe('object');
    expect(typeof response.body.weights.skills).toBe('number');
    expect(typeof response.body.weights.experience).toBe('number');
    expect(typeof response.body.weights.education).toBe('number');
  });
});
