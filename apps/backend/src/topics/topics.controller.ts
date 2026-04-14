import { Controller, Get, Param, Query, UseGuards, ParseIntPipe, Optional } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TopicsService } from './topics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Topics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all topics with question counts per difficulty' })
  @ApiResponse({ status: 200, description: 'List of all topics with counts' })
  async findAll() {
    return this.topicsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single topic with all questions and answers' })
  @ApiResponse({ status: 200, description: 'Topic with full content' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.topicsService.findBySlug(slug);
  }

  @Get(':slug/questions')
  @ApiOperation({ summary: 'Get filtered questions for a topic' })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['EASY', 'MEDIUM', 'HARD'] })
  @ApiQuery({ name: 'type', required: false, enum: ['THEORY', 'SCENARIO'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Filtered questions' })
  async findQuestions(
    @Param('slug') slug: string,
    @Query('difficulty') difficulty?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    return this.topicsService.findQuestions(
      slug,
      difficulty,
      type,
      limit ? parseInt(limit) : undefined,
    );
  }
}
