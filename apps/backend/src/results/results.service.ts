import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async findOne(resultId: string, userId: string) {
    const result = await this.prisma.testResult.findUnique({
      where: { id: resultId },
      include: {
        session: {
          include: {
            answers: {
              include: {
                question: {
                  include: { topic: { select: { slug: true, title: true, icon: true } } },
                },
              },
            },
            sessionQuestions: true,
          },
        },
      },
    });

    if (!result) throw new NotFoundException('Result not found');
    if (result.session.userId !== userId) throw new ForbiddenException('Access denied');

    const wrongAndSkipped = result.session.answers.filter(
      (a) => !a.isCorrect,
    );

    const reviewItems = wrongAndSkipped.map((answer) => {
      const sq = result.session.sessionQuestions.find(
        (sq) => sq.questionId === answer.questionId,
      );

      const yourAnswer =
        answer.selectedIndex !== null && answer.selectedIndex !== undefined
          ? sq?.shuffledOptions[answer.selectedIndex] ?? 'Skipped'
          : 'Skipped';

      const correctAnswer = sq
        ? sq.shuffledOptions[sq.shuffledCorrectIndex]
        : answer.question.options[answer.question.correctIndex];

      return {
        questionId: answer.question.id,
        question: answer.question.question,
        type: answer.question.type,
        difficulty: answer.question.difficulty,
        topic: answer.question.topic,
        yourAnswer,
        correctAnswer,
        explanation: answer.question.explanation,
        wasSkipped: answer.selectedIndex === null || answer.selectedIndex === undefined,
      };
    });

    return {
      id: result.id,
      sessionId: result.sessionId,
      score: result.score,
      correctCount: result.correctCount,
      wrongCount: result.wrongCount,
      skippedCount: result.skippedCount,
      timeTaken: result.timeTaken,
      difficulty: result.session.difficulty,
      createdAt: result.createdAt,
      reviewItems,
    };
  }

  async findHistory(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.prisma.testResult.findMany({
        where: { session: { userId } },
        include: {
          session: { select: { difficulty: true, totalQ: true, startedAt: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.testResult.count({ where: { session: { userId } } }),
    ]);

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOnePublic(resultId: string, guestToken: string) {
    const result = await this.prisma.testResult.findUnique({
      where: { id: resultId },
      include: {
        session: {
          include: {
            answers: {
              include: {
                question: {
                  include: { topic: { select: { slug: true, title: true, icon: true } } },
                },
              },
            },
            sessionQuestions: true,
          },
        },
      },
    });

    if (!result) throw new NotFoundException('Result not found');
    if (result.session.guestToken !== guestToken) throw new ForbiddenException('Invalid guest token');

    const wrongAndSkipped = result.session.answers.filter(
      (a) => !a.isCorrect,
    );

    const reviewItems = wrongAndSkipped.map((answer) => {
      const sq = result.session.sessionQuestions.find(
        (sq) => sq.questionId === answer.questionId,
      );

      const yourAnswer =
        answer.selectedIndex !== null && answer.selectedIndex !== undefined
          ? sq?.shuffledOptions[answer.selectedIndex] ?? 'Skipped'
          : 'Skipped';

      const correctAnswer = sq
        ? sq.shuffledOptions[sq.shuffledCorrectIndex]
        : answer.question.options[answer.question.correctIndex];

      return {
        questionId: answer.question.id,
        question: answer.question.question,
        type: answer.question.type,
        difficulty: answer.question.difficulty,
        topic: answer.question.topic,
        yourAnswer,
        correctAnswer,
        explanation: answer.question.explanation,
        wasSkipped: answer.selectedIndex === null || answer.selectedIndex === undefined,
      };
    });

    return {
      id: result.id,
      sessionId: result.sessionId,
      score: result.score,
      correctCount: result.correctCount,
      wrongCount: result.wrongCount,
      skippedCount: result.skippedCount,
      timeTaken: result.timeTaken,
      difficulty: result.session.difficulty,
      createdAt: result.createdAt,
      reviewItems,
      isGuest: true,
      message: 'Sign up to save your progress and track your performance over time!',
    };
  }
}
