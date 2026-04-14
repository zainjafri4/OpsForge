import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get all topic progress for current user' })
  @ApiResponse({ status: 200, description: 'Per-topic progress breakdown' })
  async getAllProgress(@Request() req) {
    return this.progressService.getAllProgress(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get overall stats: total tests, avg score, best score, streak' })
  @ApiResponse({ status: 200, description: 'Overall statistics' })
  async getStats(@Request() req) {
    return this.progressService.getStats(req.user.id);
  }

  @Get('weak-topics')
  @ApiOperation({ summary: 'Get weak and strong topics based on accuracy' })
  @ApiResponse({ status: 200, description: 'Topics analysis with accuracy scores' })
  async getWeakTopics(@Request() req) {
    return this.progressService.getWeakTopics(req.user.id);
  }
}
