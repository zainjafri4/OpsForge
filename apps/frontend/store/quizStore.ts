import { create } from 'zustand';
import { QuizState, Question } from '@/types';

export const useQuizStore = create<QuizState>((set) => ({
  sessionId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: new Map(),
  startTime: 0,

  setSession: (sessionId: string, questions: Question[]) => {
    set((state) => {
      // Don't reset if we already have this session loaded
      if (state.sessionId === sessionId && state.questions.length > 0) {
        return state;
      }
      return {
        sessionId,
        questions,
        currentQuestionIndex: 0,
        answers: new Map(),
        startTime: Date.now(),
      };
    });
  },

  setAnswer: (questionId: string, selectedIndex: number | null) => {
    set((state) => {
      const newAnswers = new Map(state.answers);
      newAnswers.set(questionId, selectedIndex);
      return { answers: newAnswers };
    });
  },

  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length - 1
      ),
    }));
  },

  previousQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    }));
  },

  clearSession: () => {
    set({
      sessionId: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: new Map(),
      startTime: 0,
    });
  },
}));
