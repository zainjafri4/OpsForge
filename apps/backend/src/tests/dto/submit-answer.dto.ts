import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({ description: 'Question ID being answered' })
  @IsString()
  questionId: string;

  @ApiPropertyOptional({ description: 'Selected option index (0-3), null if skipped', minimum: 0, maximum: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3)
  selectedIndex?: number;
}
