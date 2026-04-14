import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  TestSession,
  StartTestDto,
  SubmitAnswerDto,
  TestResult,
  SubmitAnswerResponse,
} from '@/types';
import { useQuizStore } from '@/store/quizStore';
import toast from 'react-hot-toast';

export const useStartTest = () => {
  const router = useRouter();
  const { setSession } = useQuizStore();

  return useMutation({
    mutationFn: async (dto: StartTestDto) => {
      const response = await api.post<TestSession>('/tests/start', dto);
      return response.data;
    },
    onSuccess: (data) => {
      setSession(data.id, data.questions || []);
      router.push(`/test/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start test');
    },
  });
};

export const useTestSession = (sessionId: string) => {
  return useQuery({
    queryKey: ['test-session', sessionId],
    queryFn: async () => {
      const response = await api.get<TestSession>(`/tests/${sessionId}`);
      return response.data;
    },
    enabled: !!sessionId,
  });
};

export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      answer,
    }: {
      sessionId: string;
      answer: SubmitAnswerDto;
    }) => {
      const response = await api.post<SubmitAnswerResponse>(
        `/tests/${sessionId}/answer`,
        answer
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['test-session', variables.sessionId] });
    },
  });
};

export const useSubmitTest = () => {
  const router = useRouter();
  const { clearSession } = useQuizStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.post<TestResult>(`/tests/${sessionId}/submit`);
      return response.data;
    },
    onSuccess: (data) => {
      clearSession();
      queryClient.invalidateQueries({ queryKey: ['test-history'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      router.push(`/results/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit test');
    },
  });
};

export const useTestHistory = () => {
  return useQuery({
    queryKey: ['test-history'],
    queryFn: async () => {
      const response = await api.get<TestSession[]>('/tests/history');
      return response.data;
    },
  });
};
