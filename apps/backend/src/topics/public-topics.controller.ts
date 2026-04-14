import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TopicsService } from './topics.service';

@ApiTags('Public Topics')
@Controller('topics/public')
export class PublicTopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all topics publicly (no auth required)' })
  @ApiResponse({ status: 200, description: 'List of all topics with counts' })
  async findAll() {
    return this.topicsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single topic publicly (no auth required)' })
  @ApiResponse({ status: 200, description: 'Topic with basic info' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.topicsService.findBySlugPublic(slug);
  }
}
