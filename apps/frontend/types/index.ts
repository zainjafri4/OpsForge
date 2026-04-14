// Enums
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'THEORY' | 'SCENARIO';
export type Category = 'DEVOPS' | 'AWS' | 'SRE' | 'CICD' | 'CONTAINERS' | 'IaC' | 'OBSERVABILITY';
export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED';

// User
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

// Auth
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Topic
export interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: Category;
  questionCounts?: {
    easy: number;
    medium: number;
    hard: number;
  };
}

// Question
export interface Question {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  options: string[];
  correctIndex?: number; // Not exposed during active quiz
  explanation?: string; // Not exposed during active quiz
  tags: string[];
}

// Test Session
export interface TestSession {
  id?: string;
  sessionId?: string;
  userId?: string;
  difficulty: Difficulty;
  status?: SessionStatus;
  startedAt: string;
  completedAt?: string;
  totalQ: number;
  answeredCount?: number;
  questions?: Question[];
}

export interface StartTestDto {
  difficulty: Difficulty;
  topicFilter?: string[];
  typeFilter?: QuestionType;
}

export interface SubmitAnswerDto {
  questionId: string;
  selectedIndex: number | null;
}

export interface SubmitAnswerResponse {
  isCorrect?: boolean; // May not be revealed until test completion
  progress: {
    answered: number;
    total: number;
  };
}

// Test Result
export interface TestResult {
  id: string;
  sessionId: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  timeTaken: number; // seconds
  createdAt: string;
  wrongAnswers?: {
    question: Question;
    selectedIndex: number | null;
    correctIndex: number;
    explanation: string;
  }[];
}

// User Progress
export interface UserProgress {
  id: string;
  userId: string;
  topicId: string;
  topic: Topic;
  easyAttempted: number;
  easyCorrect: number;
  mediumAttempted: number;
  mediumCorrect: number;
  hardAttempted: number;
  hardCorrect: number;
  lastAttemptedAt?: string;
}

export interface OverallStats {
  totalTests: number;
  averageScore: number;
  bestScore: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Dashboard types
export interface RecentTest {
  id: string;
  difficulty: Difficulty;
  score: number;
  createdAt: string;
  topicCount?: number;
}

// Quiz Store State
export interface QuizState {
  sessionId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Map<string, number | null>; // questionId -> selectedIndex
  startTime: number;
  setSession: (sessionId: string, questions: Question[]) => void;
  setAnswer: (questionId: string, selectedIndex: number | null) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  clearSession: () => void;
}

// Auth Store State
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}
