import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyzeModule } from './analyze/analyze.module';

@Module({
  imports: [
    // Global configuration so services can access env variables safely.
    ConfigModule.forRoot({ isGlobal: true }),
    AnalyzeModule,
  ],
})
export class AppModule {}
