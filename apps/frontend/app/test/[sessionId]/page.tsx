'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePublicSession, useSubmitPublicAnswer, useSubmitPublicTest } from '@/hooks/usePublicApi';
import { useQuizStore } from '@/store/quizStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getDifficultyBadgeColor } from '@/lib/utils';
import { ClockIcon, CheckCircleIcon, AlertCircleIcon, AlertTriangleIcon } from 'lucide-react';

export default function PublicActiveQuizPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const { data: session, isLoading } = usePublicSession(sessionId);
  const { mutate: submitAnswer } = useSubmitPublicAnswer();
  const { mutate: submitTest, isPending: isSubmitting } = useSubmitPublicTest();
  const hasAutoSubmittedRef = useRef(false);

  const {
    questions,
    currentQuestionIndex,
    answers,
    setSession,
    setAnswer,
    nextQuestion,
    previousQuestion,
  } = useQuizStore();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [testMode, setTestMode] = useState<string>('PRACTICE');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTimeLimit = localStorage.getItem('testTimeLimit');
      const storedMode = localStorage.getItem('testMode');
      if (storedTimeLimit) {
        setTimeLimit(parseInt(storedTimeLimit));
      }
      if (storedMode) {
        setTestMode(storedMode);
      }
    }
  }, []);

  useEffect(() => {
    if (session?.questions) {
      setSession(session.sessionId || sessionId, session.questions);
    }
  }, [session, setSession, sessionId]);

  const handleAutoSubmit = useCallback(() => {
    if (hasAutoSubmittedRef.current || isSubmitting) return;
    hasAutoSubmittedRef.current = true;
    submitTest({ sessionId, dto: { timeTaken: elapsedTime } });
  }, [sessionId, elapsedTime, isSubmitting, submitTest]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        if (timeLimit && newTime >= timeLimit && !hasAutoSubmittedRef.current) {
          handleAutoSubmit();
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLimit, handleAutoSubmit]);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      const savedAnswer = answers.get(currentQuestion.id);
      setSelectedOption(savedAnswer !== undefined ? savedAnswer : null);
    }
  }, [currentQuestionIndex, questions, answers]);

  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading test...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Array.from(answers.values()).filter((a) => a !== null).length;
  
  const remainingTime = timeLimit ? Math.max(0, timeLimit - elapsedTime) : null;
  const isLowTime = remainingTime !== null && remainingTime <= 60;
  const isCriticalTime = remainingTime !== null && remainingTime <= 30;

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestion && selectedOption !== null) {
      setAnswer(currentQuestion.id, selectedOption);
      submitAnswer({
        sessionId,
        dto: { questionId: currentQuestion.id, selectedIndex: selectedOption },
      });
    }

    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion && selectedOption !== null) {
      setAnswer(currentQuestion.id, selectedOption);
    }
    previousQuestion();
  };

  const handleSubmitTest = () => {
    if (hasAutoSubmittedRef.current) return;
    if (currentQuestion && selectedOption !== null) {
      setAnswer(currentQuestion.id, selectedOption);
      submitAnswer({
        sessionId,
        dto: { questionId: currentQuestion.id, selectedIndex: selectedOption },
      });
    }
    submitTest({ sessionId, dto: { timeTaken: elapsedTime } });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Time Warning Banner */}
      {isCriticalTime && (
        <div className="bg-red-600 text-white px-4 py-2 text-center animate-pulse">
          <AlertTriangleIcon className="w-4 h-4 inline mr-2" />
          Less than 30 seconds remaining! Test will auto-submit.
        </div>
      )}
      {isLowTime && !isCriticalTime && (
        <div className="bg-amber-600 text-white px-4 py-2 text-center">
          <AlertTriangleIcon className="w-4 h-4 inline mr-2" />
          Less than 1 minute remaining!
        </div>
      )}

      {/* Mini header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl">⚙️</span>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              OpsForge
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {testMode === 'MOCK_INTERVIEW' && (
              <Badge className="bg-red-600 text-white">Mock Interview</Badge>
            )}
            {testMode === 'TIMED' && (
              <Badge className="bg-amber-600 text-white">Timed</Badge>
            )}
            <Badge className="bg-indigo-600 text-white">Guest</Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 pt-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h1>
              <p className="text-sm text-gray-400">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Timer Display */}
              {remainingTime !== null ? (
                <div className={`flex items-center space-x-2 text-sm px-3 py-1 rounded ${
                  isCriticalTime 
                    ? 'bg-red-900/50 text-red-300 animate-pulse' 
                    : isLowTime 
                    ? 'bg-amber-900/50 text-amber-300'
                    : 'text-gray-300'
                }`}>
                  <ClockIcon className="w-4 h-4" />
                  <span className="font-mono font-bold">{formatTime(remainingTime)}</span>
                  <span className="text-xs">left</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <ClockIcon className="w-4 h-4" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
              )}
              <Badge className={getDifficultyBadgeColor(session?.difficulty || 'EASY')}>
                {session?.difficulty}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />

          {/* Question Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2 text-white">{currentQuestion.question}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">
                      {currentQuestion.type}
                    </Badge>
                    {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {currentQuestion.tags.join(', ')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedOption === index
                        ? 'border-indigo-500 bg-indigo-950/50 text-white'
                        : 'border-gray-600 bg-gray-750 hover:border-indigo-400 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedOption === index
                            ? 'border-indigo-500 bg-indigo-600'
                            : 'border-gray-500'
                        }`}
                      >
                        {selectedOption === index && (
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              Previous
            </Button>

            <div className="text-sm text-gray-400">
              {selectedOption === null && (
                <span className="flex items-center">
                  <AlertCircleIcon className="w-4 h-4 mr-1 text-amber-500" />
                  Select an option to continue
                </span>
              )}
            </div>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNextQuestion} disabled={selectedOption === null}>
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmitTest}
                disabled={selectedOption === null || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
