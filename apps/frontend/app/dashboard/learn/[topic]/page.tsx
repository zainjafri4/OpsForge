'use client';

import { useState } from 'react';
import { useTopic } from '@/hooks/useTopics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, PlayIcon } from 'lucide-react';
import { getDifficultyBadgeColor } from '@/lib/utils';
import { Difficulty } from '@/types';

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params.topic as string;
  const { data: topic, isLoading } = useTopic(slug);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('EASY');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading topic...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 mb-4">Topic not found</div>
        <Link href="/dashboard/learn">
          <Button variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Topics
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/dashboard/learn"
          className="text-sm text-indigo-600 hover:underline flex items-center mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Topics
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <span className="text-5xl">{topic.icon}</span>
            <div>
              <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {topic.description}
              </p>
              <div className="flex items-center space-x-2">
                <Badge>{topic.category}</Badge>
                {topic.questionCounts && (
                  <>
                    <Badge variant="success">{topic.questionCounts.easy} Easy</Badge>
                    <Badge variant="warning">{topic.questionCounts.medium} Medium</Badge>
                    <Badge variant="danger">{topic.questionCounts.hard} Hard</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
          <Link href={`/dashboard/test?topic=${slug}`}>
            <Button size="lg">
              <PlayIcon className="w-5 h-5 mr-2" />
              Start Test
            </Button>
          </Link>
        </div>
      </div>

      {/* Difficulty Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedDifficulty}
            onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="EASY">Easy</TabsTrigger>
              <TabsTrigger value="MEDIUM">Medium</TabsTrigger>
              <TabsTrigger value="HARD">Hard</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedDifficulty}>
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">
                  Questions for <span className={getDifficultyBadgeColor(selectedDifficulty) + ' px-2 py-1 rounded'}>{selectedDifficulty}</span> level
                </p>
                <p className="text-sm">
                  Start a test to practice {selectedDifficulty.toLowerCase()} questions on this
                  topic
                </p>
                <Link href={`/dashboard/test?topic=${slug}&difficulty=${selectedDifficulty}`}>
                  <Button className="mt-4">
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Start {selectedDifficulty} Test
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Learning Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Start with Easy questions to build foundational knowledge</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Read explanations carefully, even for correct answers</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Mix Theory and Scenario questions to test both knowledge and application</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Review wrong answers to identify knowledge gaps</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
