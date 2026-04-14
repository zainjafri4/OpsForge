import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Topic } from '@/types';

export const useTopics = () => {
  return useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const response = await api.get<Topic[]>('/topics');
      return response.data;
    },
  });
};

export const useTopic = (slug: string) => {
  return useQuery({
    queryKey: ['topic', slug],
    queryFn: async () => {
      const response = await api.get<Topic>(`/topics/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
};
