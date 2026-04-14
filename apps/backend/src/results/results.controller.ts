import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('history')
  @ApiOperation({ summary: 'Get paginated history of all user results' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated results history' })
  async findHistory(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.resultsService.findHistory(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':resultId')
  @ApiOperation({ summary: 'Get full result with wrong answer review and explanations' })
  @ApiResponse({ status: 200, description: 'Full result with review items' })
  @ApiResponse({ status: 404, description: 'Result not found' })
  async findOne(@Param('resultId') resultId: string, @Request() req) {
    return this.resultsService.findOne(resultId, req.user.id);
  }
}
