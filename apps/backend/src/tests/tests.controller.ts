import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { StartTestDto } from './dto/start-test.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SubmitTestDto } from './dto/submit-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new test session with randomized questions' })
  @ApiResponse({ status: 201, description: 'Session created with shuffled questions' })
  async startTest(@Request() req, @Body() dto: StartTestDto) {
    return this.testsService.startTest(req.user.id, dto);
  }

  @Get('history')
  @ApiOperation({ summary: "Get user's past test sessions" })
  @ApiResponse({ status: 200, description: 'List of past sessions' })
  async getHistory(@Request() req) {
    return this.testsService.getHistory(req.user.id);
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get an active test session (no correct answers exposed)' })
  @ApiResponse({ status: 200, description: 'Session data without answers' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(@Param('sessionId') sessionId: string, @Request() req) {
    return this.testsService.getSession(sessionId, req.user.id);
  }

  @Post(':sessionId/answer')
  @ApiOperation({ summary: 'Submit an answer for a question in the session' })
  @ApiResponse({ status: 201, description: 'Answer recorded (no correctness revealed)' })
  async submitAnswer(
    @Param('sessionId') sessionId: string,
    @Request() req,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.testsService.submitAnswer(sessionId, req.user.id, dto);
  }

  @Post(':sessionId/submit')
  @ApiOperation({ summary: 'Finalize the test session and get results' })
  @ApiResponse({ status: 201, description: 'Test result with full breakdown' })
  async submitTest(
    @Param('sessionId') sessionId: string,
    @Request() req,
    @Body() dto: SubmitTestDto,
  ) {
    return this.testsService.submitTest(sessionId, req.user.id, dto);
  }
}
