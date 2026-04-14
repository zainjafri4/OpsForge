import { Controller, Get, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ResultsService } from './results.service';

@ApiTags('Public Results')
@Controller('results/public')
export class PublicResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get(':resultId')
  @ApiOperation({ summary: 'Get anonymous test result by guest token' })
  @ApiHeader({ name: 'x-guest-token', required: true, description: 'Guest token from session start' })
  @ApiResponse({ status: 200, description: 'Full result with review items' })
  @ApiResponse({ status: 404, description: 'Result not found' })
  async findPublicResult(
    @Param('resultId') resultId: string,
    @Headers('x-guest-token') guestToken: string,
  ) {
    return this.resultsService.findOnePublic(resultId, guestToken);
  }
}
