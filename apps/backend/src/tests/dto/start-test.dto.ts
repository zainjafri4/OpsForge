import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsArray, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum QuestionType {
  THEORY = 'THEORY',
  SCENARIO = 'SCENARIO',
}

export enum TestMode {
  PRACTICE = 'PRACTICE',
  TIMED = 'TIMED',
  MOCK_INTERVIEW = 'MOCK_INTERVIEW',
}

export class StartTestDto {
  @ApiProperty({ enum: Difficulty, example: 'EASY' })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiPropertyOptional({ type: [String], description: 'Array of topic slugs to filter by' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicSlugs?: string[];

  @ApiPropertyOptional({ enum: QuestionType, description: 'Filter by question type' })
  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @ApiPropertyOptional({ enum: TestMode, default: TestMode.PRACTICE, description: 'Test mode' })
  @IsOptional()
  @IsEnum(TestMode)
  mode?: TestMode;

  @ApiPropertyOptional({ description: 'Total time limit in seconds (for timed mode)', example: 1200 })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(7200)
  timeLimit?: number;

  @ApiPropertyOptional({ description: 'Time per question in seconds', example: 60 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(300)
  perQuestionTime?: number;

  @ApiPropertyOptional({ description: 'Number of questions (default 20)', example: 20 })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(50)
  questionCount?: number;
}
