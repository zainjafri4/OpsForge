'use client';

import { useAuth } from '@/hooks/useAuth';
import { useOverallStats, useProgress, useResultsHistory } from '@/hooks/useProgress';
import { getUserDisplayName } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TrophyIcon, ClockIcon, TargetIcon, TrendingUpIcon, ClipboardListIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useOverallStats();
  const { data: progress, isLoading: progressLoading } = useProgress();
  const { data: resultsHistory } = useResultsHistory();

  if (statsLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Prepare chart data (last 10 tests, reverse chronological order)
  const chartData = resultsHistory
    ?.slice(0, 10)
    .reverse()
    .map((result, index) => ({
      name: `Test ${index + 1}`,
      score: result.score,
      date: formatDate(result.createdAt),
    })) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user ? getUserDisplayName(user) : 'there'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and continue your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tests
              </span>
              <TrophyIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold">{stats?.totalTests || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Score
              </span>
              <TargetIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold">
              {stats?.averageScore?.toFixed(1) || 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Best Score
              </span>
              <TrendingUpIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold">{stats?.bestScore?.toFixed(1) || 0}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Questions Answered
              </span>
              <ClockIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold">
              {stats?.totalQuestionsAnswered || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Start a new test or continue learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/test">
              <Button size="lg">
                <ClipboardListIcon className="w-5 h-5 mr-2" />
                Start Test
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="outline">
                <TrophyIcon className="w-5 h-5 mr-2" />
                Browse Topics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Score Trend Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Score Trend</CardTitle>
            <CardDescription>Your performance over the last 10 tests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Topic Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Progress</CardTitle>
          <CardDescription>Your performance across different topics</CardDescription>
        </CardHeader>
        <CardContent>
          {!progress || progress.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No progress yet. Start a test to begin!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {progress.slice(0, 6).map((item) => {
                const totalAttempted =
                  item.easyAttempted + item.mediumAttempted + item.hardAttempted;
                const totalCorrect =
                  item.easyCorrect + item.mediumCorrect + item.hardCorrect;
                const accuracy =
                  totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;

                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.topic.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {totalAttempted} questions
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{accuracy.toFixed(0)}%</span>
                    </div>
                    <Progress value={accuracy} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
