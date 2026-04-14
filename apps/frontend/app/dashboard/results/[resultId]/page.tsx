'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTestResult } from '@/hooks/useProgress';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  formatDate,
  getDifficultyBadgeColor,
  getScoreColor,
  getScoreBadgeColor,
} from '@/lib/utils';
import {
  ArrowLeftIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  SkipForwardIcon,
} from 'lucide-react';

export default function ResultDetailPage() {
  const params = useParams();
  const resultId = params.resultId as string;
  const { data: result, isLoading } = useTestResult(resultId);
  const [displayScore, setDisplayScore] = useState(0);

  // Count-up animation for score
  useEffect(() => {
    if (result) {
      let start = 0;
      const end = result.score;
      const duration = 1500; // 1.5 seconds
      const increment = end / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayScore(end);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [result]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading results...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 mb-4">Result not found</div>
        <Link href="/results">
          <Button variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </Link>
      </div>
    );
  }

  const totalQuestions = result.correctCount + result.wrongCount + result.skippedCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Breadcrumb */}
      <Link
        href="/results"
        className="text-sm text-indigo-600 hover:underline flex items-center"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        Back to Results
      </Link>

      {/* Score Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center space-x-2 mb-4"
              >
                <TrophyIcon className="w-8 h-8 text-indigo-600" />
                <h1 className="text-4xl font-bold">Test Complete!</h1>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6, delay: 0.5 }}
                className={`text-6xl font-bold mb-4 ${getScoreColor(result.score)}`}
              >
                {displayScore.toFixed(1)}%
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Badge className={getScoreBadgeColor(result.score) + ' text-base px-4 py-2'}>
                  {result.score >= 80
                    ? 'Excellent!'
                    : result.score >= 60
                    ? 'Good Job!'
                    : 'Keep Practicing!'}
                </Badge>
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Completed on {formatDate(result.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: CheckCircleIcon, value: result.correctCount, label: 'Correct', color: 'text-green-600', delay: 0.9 },
          { icon: XCircleIcon, value: result.wrongCount, label: 'Wrong', color: 'text-red-600', delay: 1.0 },
          { icon: SkipForwardIcon, value: result.skippedCount, label: 'Skipped', color: 'text-gray-600', delay: 1.1 },
          { icon: ClockIcon, value: `${Math.floor(result.timeTaken / 60)}m`, label: 'Time Taken', color: 'text-indigo-600', delay: 1.2 },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: stat.delay }}
          >
            <Card>
              <CardContent className="pt-6 text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Wrong Answers Review */}
      {result.wrongAnswers && result.wrongAnswers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Wrong Answers</CardTitle>
            <CardDescription>
              Learn from your mistakes to improve your score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {result.wrongAnswers.map((wrongAnswer, index) => (
                <div
                  key={index}
                  className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 dark:bg-red-950/20 rounded-r"
                >
                  <h4 className="font-semibold mb-3">{wrongAnswer.question.question}</h4>

                  <div className="space-y-2 mb-3">
                    {wrongAnswer.question.options?.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded ${
                          optIndex === wrongAnswer.correctIndex
                            ? 'bg-green-100 dark:bg-green-950/30 border-2 border-green-500'
                            : optIndex === wrongAnswer.selectedIndex
                            ? 'bg-red-100 dark:bg-red-950/30 border-2 border-red-500'
                            : 'bg-gray-50 dark:bg-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {optIndex === wrongAnswer.correctIndex && (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          )}
                          {optIndex === wrongAnswer.selectedIndex && (
                            <XCircleIcon className="w-5 h-5 text-red-600" />
                          )}
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded border border-blue-200 dark:border-blue-800">
                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-2">
                      💡 Explanation:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {wrongAnswer.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/test">
              <Button size="lg">
                <TrophyIcon className="w-5 h-5 mr-2" />
                Take Another Test
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="outline">
                Review Topics
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
}
