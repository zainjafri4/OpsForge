import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const topics = await this.prisma.topic.findMany({
      include: {
        _count: { select: { questions: true } },
      },
      orderBy: { title: 'asc' },
    });

    const topicsWithCounts = await Promise.all(
      topics.map(async (topic) => {
        const [easy, medium, hard] = await Promise.all([
          this.prisma.question.count({ where: { topicId: topic.id, difficulty: 'EASY' } }),
          this.prisma.question.count({ where: { topicId: topic.id, difficulty: 'MEDIUM' } }),
          this.prisma.question.count({ where: { topicId: topic.id, difficulty: 'HARD' } }),
        ]);

        const { _count, ...rest } = topic;
        return {
          ...rest,
          questionCounts: {
            easy,
            medium,
            hard,
            total: easy + medium + hard,
          },
        };
      }),
    );

    return topicsWithCounts;
  }

  async findBySlug(slug: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: [{ difficulty: 'asc' }, { type: 'asc' }],
        },
      },
    });

    if (!topic) throw new NotFoundException(`Topic "${slug}" not found`);

    const questionCounts = {
      easy: topic.questions.filter((q) => q.difficulty === 'EASY').length,
      medium: topic.questions.filter((q) => q.difficulty === 'MEDIUM').length,
      hard: topic.questions.filter((q) => q.difficulty === 'HARD').length,
      total: topic.questions.length,
    };

    return { ...topic, questionCounts };
  }

  async findQuestions(
    slug: string,
    difficulty?: string,
    type?: string,
    limit?: number,
  ) {
    const topic = await this.prisma.topic.findUnique({ where: { slug } });
    if (!topic) throw new NotFoundException(`Topic "${slug}" not found`);

    const where: any = { topicId: topic.id };
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;

    return this.prisma.question.findMany({
      where,
      take: limit,
      orderBy: { difficulty: 'asc' },
    });
  }
}
