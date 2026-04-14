import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all questions with optional filters' })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['EASY', 'MEDIUM', 'HARD'] })
  @ApiQuery({ name: 'type', required: false, enum: ['THEORY', 'SCENARIO'] })
  @ApiQuery({ name: 'topicId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of questions' })
  async findAll(
    @Query('difficulty') difficulty?: string,
    @Query('type') type?: string,
    @Query('topicId') topicId?: string,
  ) {
    return this.questionsService.findAll(difficulty, type, topicId);
  }
}
