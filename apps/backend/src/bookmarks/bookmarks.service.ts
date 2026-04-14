import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async addBookmark(userId: string, questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });

    if (existing) {
      throw new ConflictException('Question already bookmarked');
    }

    return this.prisma.bookmark.create({
      data: { userId, questionId },
      include: {
        question: {
          include: { topic: { select: { slug: true, title: true, icon: true } } },
        },
      },
    });
  }

  async removeBookmark(userId: string, questionId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    return this.prisma.bookmark.delete({
      where: { id: bookmark.id },
    });
  }

  async getBookmarks(userId: string, topicSlug?: string) {
    const where: any = { userId };

    if (topicSlug) {
      const topic = await this.prisma.topic.findUnique({
        where: { slug: topicSlug },
      });
      if (topic) {
        where.question = { topicId: topic.id };
      }
    }

    return this.prisma.bookmark.findMany({
      where,
      include: {
        question: {
          include: { topic: { select: { slug: true, title: true, icon: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isBookmarked(userId: string, questionId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });
    return !!bookmark;
  }

  async getBookmarkIds(userId: string): Promise<string[]> {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      select: { questionId: true },
    });
    return bookmarks.map((b) => b.questionId);
  }
}
