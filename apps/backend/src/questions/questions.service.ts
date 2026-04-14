import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(difficulty?: string, type?: string, topicId?: string) {
    const where: any = {};
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;
    if (topicId) where.topicId = topicId;

    return this.prisma.question.findMany({
      where,
      include: { topic: { select: { slug: true, title: true, icon: true } } },
      orderBy: [{ difficulty: 'asc' }, { type: 'asc' }],
    });
  }
}
