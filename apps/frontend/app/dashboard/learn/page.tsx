'use client';

import { useTopics } from '@/hooks/useTopics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

export default function LearnPage() {
  const { data: topics, isLoading } = useTopics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading topics...</div>
      </div>
    );
  }

  const groupedTopics = topics?.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {} as Record<string, typeof topics>);

  const categoryIcons: Record<string, string> = {
    DEVOPS: '🔧',
    AWS: '☁️',
    SRE: '🚨',
    CICD: '🔄',
    CONTAINERS: '🐳',
    IaC: '🏗️',
    OBSERVABILITY: '📡',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learn Topics</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep-dive into DevOps topics with theory and scenario-based questions
        </p>
      </div>

      {groupedTopics &&
        Object.entries(groupedTopics).map(([category, categoryTopics]) => (
          <div key={category}>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">{categoryIcons[category] || '📚'}</span>
              <h2 className="text-2xl font-bold">{category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTopics.map((topic) => (
                <Link key={topic.id} href={`/learn/${topic.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <span className="text-4xl mb-2">{topic.icon}</span>
                        <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {topic.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {topic.questionCounts && (
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="success" className="text-xs">
                            {topic.questionCounts.easy} Easy
                          </Badge>
                          <Badge variant="warning" className="text-xs">
                            {topic.questionCounts.medium} Medium
                          </Badge>
                          <Badge variant="danger" className="text-xs">
                            {topic.questionCounts.hard} Hard
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
