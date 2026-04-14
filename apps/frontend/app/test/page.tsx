'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStartPublicTest, usePublicTopics } from '@/hooks/usePublicApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Difficulty, QuestionType } from '@/types';
import { PlayIcon, ArrowLeftIcon, ClockIcon, TimerIcon, ZapIcon } from 'lucide-react';

type TestMode = 'PRACTICE' | 'TIMED' | 'MOCK_INTERVIEW';

function PublicTestConfigContent() {
  const searchParams = useSearchParams();
  const preselectedTopic = searchParams.get('topic');
  const preselectedDifficulty = searchParams.get('difficulty') as Difficulty | null;
  const preselectedMode = searchParams.get('mode') as TestMode | null;

  const { data: topics } = usePublicTopics();
  const { mutate: startTest, isPending } = useStartPublicTest();

  const [difficulty, setDifficulty] = useState<Difficulty>(
    preselectedDifficulty || 'EASY'
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    preselectedTopic ? [preselectedTopic] : []
  );
  const [questionType, setQuestionType] = useState<QuestionType | undefined>(undefined);
  const [testMode, setTestMode] = useState<TestMode>(preselectedMode || 'PRACTICE');
  const [timeLimit, setTimeLimit] = useState<number>(1200);

  const toggleTopic = (slug: string) => {
    setSelectedTopics((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleStartTest = () => {
    startTest({
      difficulty: testMode === 'MOCK_INTERVIEW' ? 'HARD' : difficulty,
      topicFilter: testMode === 'MOCK_INTERVIEW' ? undefined : (selectedTopics.length > 0 ? selectedTopics : undefined),
      typeFilter: questionType,
      mode: testMode,
      timeLimit: testMode !== 'PRACTICE' ? timeLimit : undefined,
    });
  };

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
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Start a Practice Test</h1>
          <p className="text-gray-600 dark:text-gray-400">
            No account needed! Take a 20-question practice test now.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            <strong>Guest Mode:</strong> Your results will be shown at the end. To track your progress over time and access detailed analytics, <Link href="/register" className="underline font-medium">create a free account</Link>.
          </p>
        </div>

        {/* Test Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Test Mode</CardTitle>
            <CardDescription>Choose your practice style</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setTestMode('PRACTICE')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  testMode === 'PRACTICE'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <PlayIcon className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold">Practice</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No time limit. Learn at your own pace.
                </p>
              </button>
              
              <button
                onClick={() => setTestMode('TIMED')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  testMode === 'TIMED'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TimerIcon className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold">Timed</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Race against the clock. Build speed.
                </p>
              </button>
              
              <button
                onClick={() => setTestMode('MOCK_INTERVIEW')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  testMode === 'MOCK_INTERVIEW'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ZapIcon className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">Mock Interview</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  45 min, all topics, hard mode. The real deal.
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Time Limit (for timed mode) */}
        {testMode === 'TIMED' && (
          <Card>
            <CardHeader>
              <CardTitle>Time Limit</CardTitle>
              <CardDescription>Select total test duration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: '10 min', value: 600 },
                  { label: '15 min', value: 900 },
                  { label: '20 min', value: 1200 },
                  { label: '30 min', value: 1800 },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={timeLimit === option.value ? 'default' : 'outline'}
                    onClick={() => setTimeLimit(option.value)}
                    className="flex-1 min-w-[100px]"
                  >
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Difficulty Selection (hidden for mock interview) */}
        {testMode !== 'MOCK_INTERVIEW' && (
          <Card>
            <CardHeader>
              <CardTitle>Difficulty Level</CardTitle>
              <CardDescription>Choose the difficulty of questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? 'default' : 'outline'}
                    onClick={() => setDifficulty(level)}
                    className="flex-1 min-w-[120px]"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Question Type (Optional)</CardTitle>
            <CardDescription>Filter by theory or scenario questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                variant={questionType === undefined ? 'default' : 'outline'}
                onClick={() => setQuestionType(undefined)}
                className="flex-1 min-w-[120px]"
              >
                Both
              </Button>
              <Button
                variant={questionType === 'THEORY' ? 'default' : 'outline'}
                onClick={() => setQuestionType('THEORY')}
                className="flex-1 min-w-[120px]"
              >
                Theory
              </Button>
              <Button
                variant={questionType === 'SCENARIO' ? 'default' : 'outline'}
                onClick={() => setQuestionType('SCENARIO')}
                className="flex-1 min-w-[120px]"
              >
                Scenario
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Topic Selection (hidden for mock interview) */}
        {testMode !== 'MOCK_INTERVIEW' && (
          <Card>
            <CardHeader>
              <CardTitle>Topics (Optional)</CardTitle>
              <CardDescription>
                Select specific topics or leave empty for a mixed test from all topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(topics) && topics.map((topic) => (
                  <Badge
                    key={topic.id}
                    variant={selectedTopics.includes(topic.slug) ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => toggleTopic(topic.slug)}
                  >
                    {topic.icon} {topic.title}
                  </Badge>
                ))}
              </div>
              {selectedTopics.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTopics([])}
                >
                  Clear Selection
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Start Button */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">Ready to start?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testMode === 'MOCK_INTERVIEW' ? (
                    <>Mock Interview: 20 hard questions from all topics, 45 minutes</>
                  ) : testMode === 'TIMED' ? (
                    <>Timed Test: 20 {difficulty.toLowerCase()} questions, {Math.floor(timeLimit / 60)} minutes
                      {selectedTopics.length > 0 && ` from ${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''}`}
                    </>
                  ) : selectedTopics.length === 0 ? (
                    <>Practice: 20 {difficulty.toLowerCase()} questions from all topics (mixed)</>
                  ) : (
                    <>Practice: 20 {difficulty.toLowerCase()} questions from {selectedTopics.length} selected topic{selectedTopics.length > 1 ? 's' : ''}</>
                  )}
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleStartTest}
                disabled={isPending}
                className={`${
                  testMode === 'MOCK_INTERVIEW' 
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                {testMode === 'MOCK_INTERVIEW' ? (
                  <ZapIcon className="w-5 h-5 mr-2" />
                ) : testMode === 'TIMED' ? (
                  <TimerIcon className="w-5 h-5 mr-2" />
                ) : (
                  <PlayIcon className="w-5 h-5 mr-2" />
                )}
                {isPending ? 'Starting...' : testMode === 'MOCK_INTERVIEW' ? 'Begin Interview' : 'Start Test'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PublicTestConfigPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <PublicTestConfigContent />
    </Suspense>
  );
}
