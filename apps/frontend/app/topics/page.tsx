'use client';

import { usePublicTopics } from '@/hooks/usePublicApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRightIcon, ArrowLeftIcon, PlayIcon } from 'lucide-react';

export default function PublicTopicsPage() {
  const { data: topics, isLoading } = usePublicTopics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-gray-500">Loading topics...</div>
      </div>
    );
  }

  const groupedTopics = Array.isArray(topics)
    ? topics.reduce((acc, topic) => {
        if (!acc[topic.category]) {
          acc[topic.category] = [];
        }
        acc[topic.category].push(topic);
        return acc;
      }, {} as Record<string, typeof topics>)
    : {};

  const categoryIcons: Record<string, string> = {
    DEVOPS: '🔧',
    AWS: '☁️',
    SRE: '🚨',
    CICD: '🔄',
    CONTAINERS: '🐳',
    IaC: '🏗️',
    OBSERVABILITY: '📡',
  };

  const categoryDescriptions: Record<string, string> = {
    DEVOPS: 'Core DevOps tools and practices',
    AWS: 'Amazon Web Services cloud platform',
    SRE: 'Site Reliability Engineering principles',
    CICD: 'Continuous Integration and Deployment',
    CONTAINERS: 'Container technologies and orchestration',
    IaC: 'Infrastructure as Code',
    OBSERVABILITY: 'Monitoring, logging, and tracing',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">⚙️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OpsForge
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/test">
              <Button variant="outline" size="sm">
                <PlayIcon className="w-4 h-4 mr-2" />
                Take Test
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb & Header */}
        <div>
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Browse Topics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our 12 comprehensive DevOps, Cloud, and SRE interview topics. Select a topic to take a focused practice test.
          </p>
        </div>

        {/* Quick Start Banner */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Want a mixed practice test?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Take a general test with questions from all topics combined.
                </p>
              </div>
              <Link href="/test">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Start General Test
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Topics by Category */}
        {groupedTopics &&
          Object.entries(groupedTopics).map(([category, categoryTopics]) => (
            <div key={category}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{categoryIcons[category] || '📚'}</span>
                <h2 className="text-2xl font-bold">{category}</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {categoryDescriptions[category] || 'Interview preparation topics'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {categoryTopics.map((topic) => (
                  <Card key={topic.id} className="h-full hover:shadow-lg transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <span className="text-4xl mb-2">{topic.icon}</span>
                      </div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {topic.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {topic.questionCounts && (
                        <div className="flex flex-wrap gap-2 mb-4">
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
                      <div className="flex gap-2">
                        <Link href={`/test?topic=${topic.slug}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            <PlayIcon className="w-4 h-4 mr-1" />
                            Practice
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            Built by{' '}
            <a
              href="https://linkedin.com/in/zainjafri4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Zain Raza Jafri
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
