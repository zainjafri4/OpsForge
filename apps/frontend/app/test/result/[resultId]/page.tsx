'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePublicResult } from '@/hooks/usePublicApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  formatDate,
  getScoreColor,
  getScoreBadgeColor,
} from '@/lib/utils';
import {
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  SkipForwardIcon,
  UserPlusIcon,
  ArrowRightIcon,
} from 'lucide-react';

export default function PublicResultPage() {
  const params = useParams();
  const resultId = params.resultId as string;
  const { data: result, isLoading } = usePublicResult(resultId);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (result) {
      let start = 0;
      const end = result.score;
      const duration = 1500;
      const increment = end / (duration / 16);

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-gray-500">Loading results...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center">
        <div className="text-gray-500 mb-4">Result not found or expired</div>
        <Link href="/test">
          <Button variant="outline">Take a New Test</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">⚙️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OpsForge
            </span>
          </Link>
          <Link href="/register">
            <Button size="sm">
              <UserPlusIcon className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
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
                  {displayScore}%
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

        {/* Signup Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/20">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                    Save Your Progress
                  </h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    Create a free account to track your scores, see detailed analytics, and identify weak areas.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href="/register">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <UserPlusIcon className="w-4 h-4 mr-2" />
                      Sign Up Free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: CheckCircleIcon, value: result.correctCount, label: 'Correct', color: 'text-green-600', delay: 1.0 },
            { icon: XCircleIcon, value: result.wrongCount, label: 'Wrong', color: 'text-red-600', delay: 1.1 },
            { icon: SkipForwardIcon, value: result.skippedCount, label: 'Skipped', color: 'text-gray-600', delay: 1.2 },
            { icon: ClockIcon, value: `${Math.floor(result.timeTaken / 60)}m`, label: 'Time', color: 'text-indigo-600', delay: 1.3 },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.delay }}
            >
              <Card>
                <CardContent className="pt-6 text-center">
                  <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Review Items */}
        {result.reviewItems && result.reviewItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Review Your Answers</CardTitle>
                <CardDescription>
                  Learn from incorrect and skipped questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.reviewItems.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`border-l-4 ${item.wasSkipped ? 'border-gray-400' : 'border-red-500'} pl-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-r`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.topic?.title || 'Unknown Topic'}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${item.wasSkipped ? 'bg-gray-200' : 'bg-red-100 text-red-700'}`}
                        >
                          {item.wasSkipped ? 'Skipped' : 'Wrong'}
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-3">{item.question}</h4>

                      <div className="space-y-2 mb-3">
                        <div className="p-3 rounded bg-red-100 dark:bg-red-950/30 border border-red-300 dark:border-red-800">
                          <div className="flex items-center space-x-2 text-sm">
                            <XCircleIcon className="w-4 h-4 text-red-600" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Your answer: <span className="font-medium">{item.yourAnswer}</span>
                            </span>
                          </div>
                        </div>
                        <div className="p-3 rounded bg-green-100 dark:bg-green-950/30 border border-green-300 dark:border-green-800">
                          <div className="flex items-center space-x-2 text-sm">
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Correct answer: <span className="font-medium">{item.correctAnswer}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded border border-blue-200 dark:border-blue-800">
                        <p className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-2">
                          Explanation:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
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
                <Link href="/topics">
                  <Button size="lg" variant="outline">
                    Browse Topics
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
