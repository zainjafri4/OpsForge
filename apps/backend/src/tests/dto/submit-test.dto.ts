import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SubmitTestDto {
  @ApiProperty({ description: 'Time taken in seconds' })
  @IsInt()
  @Min(0)
  timeTaken: number;
}
