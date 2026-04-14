import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Difficulty, QuestionType, Topic, TestSession, Question, TestResult } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type TestMode = 'PRACTICE' | 'TIMED' | 'MOCK_INTERVIEW';

interface StartPublicTestDto {
  difficulty: Difficulty;
  topicFilter?: string[];
  typeFilter?: QuestionType;
  mode?: TestMode;
  timeLimit?: number;
}

interface PublicTestResponse {
  sessionId: string;
  guestToken: string;
  difficulty: Difficulty;
  totalQ: number;
  startedAt: string;
  questions: Question[];
  mode?: TestMode;
  timeLimit?: number;
}

interface SubmitAnswerDto {
  questionId: string;
  selectedIndex: number | null;
}

interface SubmitTestDto {
  timeTaken: number;
}

export const usePublicTopics = () => {
  return useQuery({
    queryKey: ['public-topics'],
    queryFn: async () => {
      const response = await publicApi.get<Topic[]>('/topics/public');
      return response.data;
    },
  });
};

export const usePublicTopic = (slug: string) => {
  return useQuery({
    queryKey: ['public-topic', slug],
    queryFn: async () => {
      const response = await publicApi.get<Topic>(`/topics/public/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
};

export const useStartPublicTest = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (dto: StartPublicTestDto) => {
      const response = await publicApi.post<PublicTestResponse>('/tests/public/start', {
        difficulty: dto.difficulty,
        topicSlugs: dto.topicFilter,
        type: dto.typeFilter,
        mode: dto.mode,
        timeLimit: dto.timeLimit,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('guestToken', data.guestToken);
        localStorage.setItem('guestSessionId', data.sessionId);
        if (data.timeLimit) {
          localStorage.setItem('testTimeLimit', String(data.timeLimit));
          localStorage.setItem('testMode', data.mode || 'PRACTICE');
        } else {
          localStorage.removeItem('testTimeLimit');
          localStorage.removeItem('testMode');
        }
      }
      router.push(`/test/${data.sessionId}`);
    },
  });
};

export const usePublicSession = (sessionId: string) => {
  return useQuery({
    queryKey: ['public-session', sessionId],
    queryFn: async () => {
      const guestToken = typeof window !== 'undefined' ? localStorage.getItem('guestToken') : null;
      const response = await publicApi.get(`/tests/public/${sessionId}`, {
        headers: {
          'x-guest-token': guestToken || '',
        },
      });
      return response.data;
    },
    enabled: !!sessionId,
  });
};

export const useSubmitPublicAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, dto }: { sessionId: string; dto: SubmitAnswerDto }) => {
      const guestToken = typeof window !== 'undefined' ? localStorage.getItem('guestToken') : null;
      const response = await publicApi.post(`/tests/public/${sessionId}/answer`, dto, {
        headers: {
          'x-guest-token': guestToken || '',
        },
      });
      return response.data;
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['public-session', sessionId] });
    },
  });
};

export const useSubmitPublicTest = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ sessionId, dto }: { sessionId: string; dto: SubmitTestDto }) => {
      const guestToken = typeof window !== 'undefined' ? localStorage.getItem('guestToken') : null;
      const response = await publicApi.post(`/tests/public/${sessionId}/submit`, dto, {
        headers: {
          'x-guest-token': guestToken || '',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      router.push(`/test/result/${data.id}`);
    },
  });
};

export const usePublicResult = (resultId: string) => {
  return useQuery({
    queryKey: ['public-result', resultId],
    queryFn: async () => {
      const guestToken = typeof window !== 'undefined' ? localStorage.getItem('guestToken') : null;
      const response = await publicApi.get(`/results/public/${resultId}`, {
        headers: {
          'x-guest-token': guestToken || '',
        },
      });
      return response.data;
    },
    enabled: !!resultId,
  });
};
