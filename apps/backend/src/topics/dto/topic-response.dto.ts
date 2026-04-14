import { ApiProperty } from '@nestjs/swagger';

export class TopicResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  questionCounts: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}
