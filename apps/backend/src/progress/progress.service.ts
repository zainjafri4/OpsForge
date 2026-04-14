import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getAllProgress(userId: string) {
    const topics = await this.prisma.topic.findMany({
      select: { id: true, slug: true, title: true, icon: true, category: true },
      orderBy: { title: 'asc' },
    });

    const progress = await this.prisma.userProgress.findMany({
      where: { userId },
    });

    return topics.map((topic) => {
      const p = progress.find((pr) => pr.topicId === topic.id);
      return {
        topic,
        progress: p
          ? {
              easyAttempted: p.easyAttempted,
              easyCorrect: p.easyCorrect,
              mediumAttempted: p.mediumAttempted,
              mediumCorrect: p.mediumCorrect,
              hardAttempted: p.hardAttempted,
              hardCorrect: p.hardCorrect,
              lastAttemptedAt: p.lastAttemptedAt,
            }
          : {
              easyAttempted: 0,
              easyCorrect: 0,
              mediumAttempted: 0,
              mediumCorrect: 0,
              hardAttempted: 0,
              hardCorrect: 0,
              lastAttemptedAt: null,
            },
      };
    });
  }

  async getStats(userId: string) {
    const [sessions, results] = await Promise.all([
      this.prisma.testSession.findMany({
        where: { userId, status: 'COMPLETED' },
        include: { result: true },
        orderBy: { startedAt: 'asc' },
      }),
      this.prisma.testResult.findMany({
        where: { session: { userId } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalTests = sessions.length;
    const scores = results.map((r) => r.score);
    const avgScore =
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

    const last10 = results.slice(0, 10).map((r, i) => ({
      index: i + 1,
      score: r.score,
      date: r.createdAt,
    }));

    let streak = 0;
    const today = new Date();
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );

    for (const session of sortedSessions) {
      const daysDiff = Math.floor(
        (today.getTime() - new Date(session.startedAt).getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalTests,
      avgScore,
      bestScore,
      streak,
      scoreHistory: last10.reverse(),
    };
  }
}
