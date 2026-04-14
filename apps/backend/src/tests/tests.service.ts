import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartTestDto } from './dto/start-test.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SubmitTestDto } from './dto/submit-test.dto';
import { randomUUID } from 'crypto';

function fisherYates<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async startTest(userId: string, dto: StartTestDto) {
    const where: any = { difficulty: dto.difficulty };

    if (dto.topicSlugs && dto.topicSlugs.length > 0) {
      const topics = await this.prisma.topic.findMany({
        where: { slug: { in: dto.topicSlugs } },
        select: { id: true },
      });
      where.topicId = { in: topics.map((t) => t.id) };
    }

    if (dto.type) where.type = dto.type;

    const allQuestions = await this.prisma.question.findMany({
      where,
      include: { topic: { select: { slug: true, title: true, icon: true } } },
    });

    if (allQuestions.length < 5) {
      throw new BadRequestException(
        'Not enough questions available for the selected filters. Please broaden your selection.',
      );
    }

    const shuffledQuestions = fisherYates(allQuestions).slice(0, 20);

    const session = await this.prisma.$transaction(async (tx) => {
      const newSession = await tx.testSession.create({
        data: {
          userId,
          difficulty: dto.difficulty,
          topicFilter: dto.topicSlugs || [],
          typeFilter: dto.type || null,
          totalQ: shuffledQuestions.length,
        },
      });

      const sessionQuestions = shuffledQuestions.map((q, idx) => {
        const indexedOptions = q.options.map((opt, i) => ({ opt, i }));
        const shuffledIndexed = fisherYates(indexedOptions);
        const shuffledOptions = shuffledIndexed.map((x) => x.opt);
        const shuffledCorrectIndex = shuffledIndexed.findIndex(
          (x) => x.i === q.correctIndex,
        );

        return {
          sessionId: newSession.id,
          questionId: q.id,
          shuffledOptions,
          shuffledCorrectIndex,
          position: idx,
        };
      });

      await tx.sessionQuestion.createMany({ data: sessionQuestions });

      return newSession;
    });

    const sessionQuestionsWithData = await this.prisma.sessionQuestion.findMany({
      where: { sessionId: session.id },
      include: {
        question: {
          include: { topic: { select: { slug: true, title: true, icon: true } } },
        },
      },
      orderBy: { position: 'asc' },
    });

    return {
      sessionId: session.id,
      difficulty: session.difficulty,
      totalQ: session.totalQ,
      startedAt: session.startedAt,
      questions: sessionQuestionsWithData.map((sq) => ({
        id: sq.question.id,
        sessionQuestionId: sq.id,
        question: sq.question.question,
        options: sq.shuffledOptions,
        type: sq.question.type,
        difficulty: sq.question.difficulty,
        topic: sq.question.topic,
        tags: sq.question.tags,
      })),
    };
  }

  async getSession(sessionId: string, userId: string) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        sessionQuestions: {
          include: {
            question: {
              include: { topic: { select: { slug: true, title: true, icon: true } } },
            },
          },
          orderBy: { position: 'asc' },
        },
        answers: true,
      },
    });

    if (!session) throw new NotFoundException('Test session not found');
    if (session.userId !== userId) throw new ForbiddenException('Access denied');

    const answeredIds = new Set(session.answers.map((a) => a.questionId));

    return {
      sessionId: session.id,
      difficulty: session.difficulty,
      status: session.status,
      totalQ: session.totalQ,
      startedAt: session.startedAt,
      answeredCount: session.answers.length,
      questions: session.sessionQuestions.map((sq) => ({
        id: sq.question.id,
        question: sq.question.question,
        options: sq.shuffledOptions,
        type: sq.question.type,
        difficulty: sq.question.difficulty,
        topic: sq.question.topic,
        tags: sq.question.tags,
        isAnswered: answeredIds.has(sq.questionId),
      })),
    };
  }

  async submitAnswer(sessionId: string, userId: string, dto: SubmitAnswerDto) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Test session not found');
    if (session.userId !== userId) throw new ForbiddenException('Access denied');
    if (session.status === 'COMPLETED') {
      throw new BadRequestException('Test session already completed');
    }

    const sessionQuestion = await this.prisma.sessionQuestion.findFirst({
      where: { sessionId, questionId: dto.questionId },
    });

    if (!sessionQuestion) {
      throw new BadRequestException('Question not found in this session');
    }

    const isCorrect =
      dto.selectedIndex !== undefined && dto.selectedIndex !== null
        ? dto.selectedIndex === sessionQuestion.shuffledCorrectIndex
        : false;

    const existingAnswer = await this.prisma.testAnswer.findFirst({
      where: { sessionId, questionId: dto.questionId },
    });

    let answer;
    if (existingAnswer) {
      answer = await this.prisma.testAnswer.update({
        where: { id: existingAnswer.id },
        data: {
          selectedIndex: dto.selectedIndex ?? null,
          isCorrect,
          answeredAt: new Date(),
        },
      });
    } else {
      answer = await this.prisma.testAnswer.create({
        data: {
          sessionId,
          questionId: dto.questionId,
          selectedIndex: dto.selectedIndex ?? null,
          isCorrect,
        },
      });
    }

    const totalAnswered = await this.prisma.testAnswer.count({ where: { sessionId } });

    return {
      answerId: answer.id,
      progress: {
        answered: totalAnswered,
        total: session.totalQ,
      },
    };
  }

  async submitTest(sessionId: string, userId: string, dto: SubmitTestDto) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        answers: true,
        sessionQuestions: { include: { question: { include: { topic: true } } } },
      },
    });

    if (!session) throw new NotFoundException('Test session not found');
    if (session.userId !== userId) throw new ForbiddenException('Access denied');
    if (session.status === 'COMPLETED') {
      const result = await this.prisma.testResult.findUnique({ where: { sessionId } });
      return result;
    }

    const answeredIds = new Set(session.answers.map((a) => a.questionId));
    const correctCount = session.answers.filter((a) => a.isCorrect).length;
    const wrongCount = session.answers.filter(
      (a) => !a.isCorrect && a.selectedIndex !== null,
    ).length;
    const skippedCount =
      session.totalQ -
      session.answers.filter((a) => a.selectedIndex !== null).length;
    const score = Math.round((correctCount / session.totalQ) * 100);

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.testSession.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      const newResult = await tx.testResult.create({
        data: {
          sessionId,
          score,
          correctCount,
          wrongCount,
          skippedCount,
          timeTaken: dto.timeTaken,
        },
      });

      for (const sq of session.sessionQuestions) {
        const answer = session.answers.find((a) => a.questionId === sq.questionId);
        if (!answer) continue;

        const diff = sq.question.difficulty;
        const topicId = sq.question.topicId;

        const increment: any = {};
        if (diff === 'EASY') {
          increment.easyAttempted = 1;
          if (answer.isCorrect) increment.easyCorrect = 1;
        } else if (diff === 'MEDIUM') {
          increment.mediumAttempted = 1;
          if (answer.isCorrect) increment.mediumCorrect = 1;
        } else {
          increment.hardAttempted = 1;
          if (answer.isCorrect) increment.hardCorrect = 1;
        }

        await tx.userProgress.upsert({
          where: { userId_topicId: { userId, topicId } },
          update: {
            ...Object.fromEntries(
              Object.entries(increment).map(([k, v]) => [k, { increment: v as number }]),
            ),
            lastAttemptedAt: new Date(),
          },
          create: {
            userId,
            topicId,
            easyAttempted: increment.easyAttempted || 0,
            easyCorrect: increment.easyCorrect || 0,
            mediumAttempted: increment.mediumAttempted || 0,
            mediumCorrect: increment.mediumCorrect || 0,
            hardAttempted: increment.hardAttempted || 0,
            hardCorrect: increment.hardCorrect || 0,
            lastAttemptedAt: new Date(),
          },
        });
      }

      return newResult;
    });

    return result;
  }

  async getHistory(userId: string) {
    return this.prisma.testSession.findMany({
      where: { userId },
      include: {
        result: true,
      },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });
  }

  async startPublicTest(dto: StartTestDto) {
    const where: any = { difficulty: dto.difficulty };

    if (dto.topicSlugs && dto.topicSlugs.length > 0) {
      const topics = await this.prisma.topic.findMany({
        where: { slug: { in: dto.topicSlugs } },
        select: { id: true },
      });
      where.topicId = { in: topics.map((t) => t.id) };
    }

    if (dto.type) where.type = dto.type;

    const allQuestions = await this.prisma.question.findMany({
      where,
      include: { topic: { select: { slug: true, title: true, icon: true } } },
    });

    if (allQuestions.length < 5) {
      throw new BadRequestException(
        'Not enough questions available for the selected filters. Please broaden your selection.',
      );
    }

    const shuffledQuestions = fisherYates(allQuestions).slice(0, 20);
    const guestToken = randomUUID();

    const session = await this.prisma.$transaction(async (tx) => {
      const newSession = await tx.testSession.create({
        data: {
          userId: null,
          guestToken,
          difficulty: dto.difficulty,
          topicFilter: dto.topicSlugs || [],
          typeFilter: dto.type || null,
          totalQ: shuffledQuestions.length,
        },
      });

      const sessionQuestions = shuffledQuestions.map((q, idx) => {
        const indexedOptions = q.options.map((opt, i) => ({ opt, i }));
        const shuffledIndexed = fisherYates(indexedOptions);
        const shuffledOptions = shuffledIndexed.map((x) => x.opt);
        const shuffledCorrectIndex = shuffledIndexed.findIndex(
          (x) => x.i === q.correctIndex,
        );

        return {
          sessionId: newSession.id,
          questionId: q.id,
          shuffledOptions,
          shuffledCorrectIndex,
          position: idx,
        };
      });

      await tx.sessionQuestion.createMany({ data: sessionQuestions });

      return newSession;
    });

    const sessionQuestionsWithData = await this.prisma.sessionQuestion.findMany({
      where: { sessionId: session.id },
      include: {
        question: {
          include: { topic: { select: { slug: true, title: true, icon: true } } },
        },
      },
      orderBy: { position: 'asc' },
    });

    return {
      sessionId: session.id,
      guestToken,
      difficulty: session.difficulty,
      totalQ: session.totalQ,
      startedAt: session.startedAt,
      questions: sessionQuestionsWithData.map((sq) => ({
        id: sq.question.id,
        sessionQuestionId: sq.id,
        question: sq.question.question,
        options: sq.shuffledOptions,
        type: sq.question.type,
        difficulty: sq.question.difficulty,
        topic: sq.question.topic,
        tags: sq.question.tags,
      })),
    };
  }

  async getPublicSession(sessionId: string, guestToken: string) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        sessionQuestions: {
          include: {
            question: {
              include: { topic: { select: { slug: true, title: true, icon: true } } },
            },
          },
          orderBy: { position: 'asc' },
        },
        answers: true,
      },
    });

    if (!session) throw new NotFoundException('Test session not found');
    if (session.guestToken !== guestToken) throw new ForbiddenException('Invalid guest token');

    const answeredIds = new Set(session.answers.map((a) => a.questionId));

    return {
      sessionId: session.id,
      difficulty: session.difficulty,
      status: session.status,
      totalQ: session.totalQ,
      startedAt: session.startedAt,
      answeredCount: session.answers.length,
      questions: session.sessionQuestions.map((sq) => ({
        id: sq.question.id,
        question: sq.question.question,
        options: sq.shuffledOptions,
        type: sq.question.type,
        difficulty: sq.question.difficulty,
        topic: sq.question.topic,
        tags: sq.question.tags,
        isAnswered: answeredIds.has(sq.questionId),
      })),
    };
  }

  async submitPublicAnswer(sessionId: string, guestToken: string, dto: SubmitAnswerDto) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Test session not found');
    if (session.guestToken !== guestToken) throw new ForbiddenException('Invalid guest token');
    if (session.status === 'COMPLETED') {
      throw new BadRequestException('Test session already completed');
    }

    const sessionQuestion = await this.prisma.sessionQuestion.findFirst({
      where: { sessionId, questionId: dto.questionId },
    });

    if (!sessionQuestion) {
      throw new BadRequestException('Question not found in this session');
    }

    const isCorrect =
      dto.selectedIndex !== undefined && dto.selectedIndex !== null
        ? dto.selectedIndex === sessionQuestion.shuffledCorrectIndex
        : false;

    const existingAnswer = await this.prisma.testAnswer.findFirst({
      where: { sessionId, questionId: dto.questionId },
    });

    let answer;
    if (existingAnswer) {
      answer = await this.prisma.testAnswer.update({
        where: { id: existingAnswer.id },
        data: {
          selectedIndex: dto.selectedIndex ?? null,
          isCorrect,
          answeredAt: new Date(),
        },
      });
    } else {
      answer = await this.prisma.testAnswer.create({
        data: {
          sessionId,
          questionId: dto.questionId,
          selectedIndex: dto.selectedIndex ?? null,
          isCorrect,
        },
      });
    }

    const totalAnswered = await this.prisma.testAnswer.count({ where: { sessionId } });

    return {
      answerId: answer.id,
      progress: {
        answered: totalAnswered,
        total: session.totalQ,
      },
    };
  }

  async submitPublicTest(sessionId: string, guestToken: string, dto: SubmitTestDto) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        answers: true,
        sessionQuestions: { include: { question: { include: { topic: true } } } },
      },
    });

    if (!session) throw new NotFoundException('Test session not found');
    if (session.guestToken !== guestToken) throw new ForbiddenException('Invalid guest token');
    if (session.status === 'COMPLETED') {
      const result = await this.prisma.testResult.findUnique({ where: { sessionId } });
      return result;
    }

    const correctCount = session.answers.filter((a) => a.isCorrect).length;
    const wrongCount = session.answers.filter(
      (a) => !a.isCorrect && a.selectedIndex !== null,
    ).length;
    const skippedCount =
      session.totalQ -
      session.answers.filter((a) => a.selectedIndex !== null).length;
    const score = Math.round((correctCount / session.totalQ) * 100);

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.testSession.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      const newResult = await tx.testResult.create({
        data: {
          sessionId,
          score,
          correctCount,
          wrongCount,
          skippedCount,
          timeTaken: dto.timeTaken,
        },
      });

      return newResult;
    });

    return {
      ...result,
      isGuest: true,
      message: 'Sign up to save your progress and track your performance over time!',
    };
  }
}
