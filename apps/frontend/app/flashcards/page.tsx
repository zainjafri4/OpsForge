'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePublicTopics } from '@/hooks/usePublicApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Difficulty } from '@/types';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon,
  RotateCwIcon,
  ShuffleIcon,
  HomeIcon,
  RefreshCwIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FlashcardQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type: string;
  difficulty: string;
  topic: {
    title: string;
    icon: string;
  };
}

export default function FlashcardsPage() {
  const { data: topics } = usePublicTopics();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('EASY');
  const [questions, setQuestions] = useState<FlashcardQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('difficulty', selectedDifficulty);
      if (selectedTopic) {
        params.append('topic', selectedTopic);
      }
      params.append('limit', '20');
      
      const response = await axios.get(`${API_URL}/topics/public/${selectedTopic || 'linux-shell'}/questions?${params}`);
      
      const shuffled = [...response.data].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
      setHasStarted(true);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
    setIsLoading(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  const handleShuffle = () => {
    setQuestions([...questions].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setHasStarted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentQuestion = questions[currentIndex];

  if (!hasStarted) {
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
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Flashcard Mode</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review questions at your own pace. Flip cards to reveal answers and explanations.
            </p>
          </div>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Select Topic</CardTitle>
              <CardDescription>Choose a topic to practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(topics) && topics.map((topic) => (
                  <Badge
                    key={topic.id}
                    variant={selectedTopic === topic.slug ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setSelectedTopic(topic.slug)}
                  >
                    {topic.icon} {topic.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Difficulty Level</CardTitle>
              <CardDescription>Choose the difficulty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => (
                  <Button
                    key={level}
                    variant={selectedDifficulty === level ? 'default' : 'outline'}
                    onClick={() => setSelectedDifficulty(level)}
                    className="flex-1 min-w-[120px]"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full"
            onClick={fetchQuestions}
            disabled={!selectedTopic || isLoading}
          >
            {isLoading ? 'Loading...' : 'Start Flashcards'}
          </Button>
        </div>
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
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {currentIndex + 1} / {questions.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <HomeIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`relative cursor-pointer transition-transform duration-500 transform-style-preserve-3d min-h-[400px] ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of card */}
                <Card 
                  className={`absolute inset-0 backface-hidden p-8 ${isFlipped ? 'invisible' : ''}`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">
                        {currentQuestion?.topic?.icon} {currentQuestion?.topic?.title}
                      </Badge>
                      <Badge className={
                        currentQuestion?.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                        currentQuestion?.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {currentQuestion?.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl leading-relaxed">
                      {currentQuestion?.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mt-4">
                      {currentQuestion?.options?.map((option, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                        >
                          <span className="font-medium text-gray-500 mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-6">
                      <RotateCwIcon className="w-4 h-4 inline mr-1" />
                      Click to reveal answer
                    </p>
                  </CardContent>
                </Card>

                {/* Back of card */}
                <Card 
                  className={`absolute inset-0 backface-hidden p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 ${!isFlipped ? 'invisible' : ''}`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700 dark:text-green-400">
                      Correct Answer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border-2 border-green-500 mb-6">
                      <span className="font-bold text-green-700 dark:text-green-400 mr-2">
                        {String.fromCharCode(65 + (currentQuestion?.correctIndex || 0))}.
                      </span>
                      {currentQuestion?.options?.[currentQuestion?.correctIndex]}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Explanation:</h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {currentQuestion?.explanation}
                      </p>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                      <RotateCwIcon className="w-4 h-4 inline mr-1" />
                      Click to see question
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button variant="ghost" onClick={handleShuffle}>
            <ShuffleIcon className="w-4 h-4 mr-2" />
            Shuffle
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            Next
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Quick topic info */}
        <div className="mt-8 text-center">
          <Badge variant="outline" className="text-xs">
            {currentQuestion?.type} Question
          </Badge>
        </div>
      </div>
    </div>
  );
}
