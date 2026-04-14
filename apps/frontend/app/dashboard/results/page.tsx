'use client';

import { useResultsHistory } from '@/hooks/useProgress';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDate, getDifficultyBadgeColor, getScoreColor } from '@/lib/utils';
import { EyeIcon, TrophyIcon } from 'lucide-react';

export default function ResultsHistoryPage() {
  const { data: results, isLoading } = useResultsHistory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Test Results</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your past test performances
          </p>
        </div>
        <Link href="/dashboard/test">
          <Button>
            <TrophyIcon className="w-4 h-4 mr-2" />
            New Test
          </Button>
        </Link>
      </div>

      {!results || results.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-gray-500 mb-4">No test results yet</p>
            <Link href="/dashboard/test">
              <Button>Take Your First Test</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score.toFixed(1)}%
                      </span>
                      <Badge className={getDifficultyBadgeColor('EASY')}>
                        Test #{result.id.slice(0, 8)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        ✅ {result.correctCount} Correct
                      </span>
                      <span>
                        ❌ {result.wrongCount} Wrong
                      </span>
                      <span>
                        ⏭️ {result.skippedCount} Skipped
                      </span>
                      <span>
                        ⏱️ {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                      </span>
                      <span>{formatDate(result.createdAt)}</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/results/${result.id}`}>
                    <Button variant="outline">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
