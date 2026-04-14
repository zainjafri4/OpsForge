import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { UserProgress, OverallStats, TestResult } from '@/types';

export const useProgress = () => {
  return useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const response = await api.get<UserProgress[]>('/progress');
      return response.data;
    },
  });
};

export const useOverallStats = () => {
  return useQuery({
    queryKey: ['progress', 'stats'],
    queryFn: async () => {
      const response = await api.get<OverallStats>('/progress/stats');
      return response.data;
    },
  });
};

export const useTestResult = (resultId: string) => {
  return useQuery({
    queryKey: ['result', resultId],
    queryFn: async () => {
      const response = await api.get<TestResult>(`/results/${resultId}`);
      return response.data;
    },
    enabled: !!resultId,
  });
};

export const useResultsHistory = () => {
  return useQuery({
    queryKey: ['results-history'],
    queryFn: async () => {
      const response = await api.get<TestResult[]>('/results/history');
      return response.data;
    },
  });
};
