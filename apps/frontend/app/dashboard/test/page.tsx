'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStartTest } from '@/hooks/useTest';
import { useTopics } from '@/hooks/useTopics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Difficulty, QuestionType } from '@/types';
import { PlayIcon } from 'lucide-react';

export default function TestConfigPage() {
  const searchParams = useSearchParams();
  const preselectedTopic = searchParams.get('topic');
  const preselectedDifficulty = searchParams.get('difficulty') as Difficulty | null;

  const { data: topics } = useTopics();
  const { mutate: startTest, isPending } = useStartTest();

  const [difficulty, setDifficulty] = useState<Difficulty>(
    preselectedDifficulty || 'EASY'
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    preselectedTopic ? [preselectedTopic] : []
  );
  const [questionType, setQuestionType] = useState<QuestionType | undefined>(undefined);

  const toggleTopic = (slug: string) => {
    setSelectedTopics((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleStartTest = () => {
    startTest({
      difficulty,
      topicFilter: selectedTopics.length > 0 ? selectedTopics : undefined,
      typeFilter: questionType,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configure Test</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your test with 20 questions
        </p>
      </div>

      {/* Difficulty Selection */}
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

      {/* Topic Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Topics (Optional)</CardTitle>
          <CardDescription>
            Select specific topics or leave empty for all topics
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

      {/* Start Button */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Ready to start?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test will contain 20 {difficulty.toLowerCase()} questions
                {selectedTopics.length > 0 &&
                  ` from ${selectedTopics.length} selected topic${selectedTopics.length > 1 ? 's' : ''}`}
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleStartTest}
              disabled={isPending}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              {isPending ? 'Starting...' : 'Start Test'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
