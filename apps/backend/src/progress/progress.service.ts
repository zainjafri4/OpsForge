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

  async getWeakTopics(userId: string) {
    const progress = await this.prisma.userProgress.findMany({
      where: { userId },
      include: { topic: { select: { id: true, slug: true, title: true, icon: true } } },
    });

    const topicScores = progress.map((p) => {
      const totalAttempted = p.easyAttempted + p.mediumAttempted + p.hardAttempted;
      const totalCorrect = p.easyCorrect + p.mediumCorrect + p.hardCorrect;
      const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

      return {
        topic: p.topic,
        totalAttempted,
        totalCorrect,
        accuracy,
        easyAccuracy: p.easyAttempted > 0 ? Math.round((p.easyCorrect / p.easyAttempted) * 100) : null,
        mediumAccuracy: p.mediumAttempted > 0 ? Math.round((p.mediumCorrect / p.mediumAttempted) * 100) : null,
        hardAccuracy: p.hardAttempted > 0 ? Math.round((p.hardCorrect / p.hardAttempted) * 100) : null,
      };
    });

    const weakTopics = topicScores
      .filter((t) => t.accuracy !== null && t.accuracy < 70 && t.totalAttempted >= 3)
      .sort((a, b) => (a.accuracy || 0) - (b.accuracy || 0))
      .slice(0, 5);

    const strongTopics = topicScores
      .filter((t) => t.accuracy !== null && t.accuracy >= 80 && t.totalAttempted >= 3)
      .sort((a, b) => (b.accuracy || 0) - (a.accuracy || 0))
      .slice(0, 5);

    return {
      weakTopics,
      strongTopics,
      allTopicScores: topicScores.filter((t) => t.totalAttempted > 0).sort((a, b) => (a.accuracy || 0) - (b.accuracy || 0)),
    };
  }
}
