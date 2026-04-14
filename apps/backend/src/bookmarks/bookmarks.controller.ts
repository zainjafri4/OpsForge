import { Controller, Post, Delete, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Bookmarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookmarked questions' })
  @ApiQuery({ name: 'topic', required: false, description: 'Filter by topic slug' })
  @ApiResponse({ status: 200, description: 'List of bookmarked questions' })
  async getBookmarks(@Request() req, @Query('topic') topicSlug?: string) {
    return this.bookmarksService.getBookmarks(req.user.id, topicSlug);
  }

  @Get('ids')
  @ApiOperation({ summary: 'Get list of bookmarked question IDs' })
  @ApiResponse({ status: 200, description: 'Array of question IDs' })
  async getBookmarkIds(@Request() req) {
    return this.bookmarksService.getBookmarkIds(req.user.id);
  }

  @Post(':questionId')
  @ApiOperation({ summary: 'Bookmark a question' })
  @ApiResponse({ status: 201, description: 'Question bookmarked' })
  @ApiResponse({ status: 409, description: 'Already bookmarked' })
  async addBookmark(@Request() req, @Param('questionId') questionId: string) {
    return this.bookmarksService.addBookmark(req.user.id, questionId);
  }

  @Delete(':questionId')
  @ApiOperation({ summary: 'Remove bookmark from a question' })
  @ApiResponse({ status: 200, description: 'Bookmark removed' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  async removeBookmark(@Request() req, @Param('questionId') questionId: string) {
    return this.bookmarksService.removeBookmark(req.user.id, questionId);
  }

  @Get(':questionId/status')
  @ApiOperation({ summary: 'Check if a question is bookmarked' })
  @ApiResponse({ status: 200, description: 'Bookmark status' })
  async isBookmarked(@Request() req, @Param('questionId') questionId: string) {
    const isBookmarked = await this.bookmarksService.isBookmarked(req.user.id, questionId);
    return { isBookmarked };
  }
}
