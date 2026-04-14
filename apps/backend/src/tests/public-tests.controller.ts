import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { StartTestDto } from './dto/start-test.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SubmitTestDto } from './dto/submit-test.dto';

@ApiTags('Public Tests')
@Controller('tests/public')
export class PublicTestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new anonymous test session' })
  @ApiResponse({ status: 201, description: 'Session created with shuffled questions and guest token' })
  async startPublicTest(@Body() dto: StartTestDto) {
    return this.testsService.startPublicTest(dto);
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get an anonymous test session' })
  @ApiHeader({ name: 'x-guest-token', required: true, description: 'Guest token from session start' })
  @ApiResponse({ status: 200, description: 'Session data without answers' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getPublicSession(
    @Param('sessionId') sessionId: string,
    @Headers('x-guest-token') guestToken: string,
  ) {
    return this.testsService.getPublicSession(sessionId, guestToken);
  }

  @Post(':sessionId/answer')
  @ApiOperation({ summary: 'Submit an answer for an anonymous test' })
  @ApiHeader({ name: 'x-guest-token', required: true, description: 'Guest token from session start' })
  @ApiResponse({ status: 201, description: 'Answer recorded' })
  async submitPublicAnswer(
    @Param('sessionId') sessionId: string,
    @Headers('x-guest-token') guestToken: string,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.testsService.submitPublicAnswer(sessionId, guestToken, dto);
  }

  @Post(':sessionId/submit')
  @ApiOperation({ summary: 'Finalize anonymous test and get results' })
  @ApiHeader({ name: 'x-guest-token', required: true, description: 'Guest token from session start' })
  @ApiResponse({ status: 201, description: 'Test result' })
  async submitPublicTest(
    @Param('sessionId') sessionId: string,
    @Headers('x-guest-token') guestToken: string,
    @Body() dto: SubmitTestDto,
  ) {
    return this.testsService.submitPublicTest(sessionId, guestToken, dto);
  }
}
