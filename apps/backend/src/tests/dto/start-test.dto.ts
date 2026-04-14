import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsArray, IsString } from 'class-validator';

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum QuestionType {
  THEORY = 'THEORY',
  SCENARIO = 'SCENARIO',
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
}
