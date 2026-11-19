import { useQuery } from '@tanstack/react-query';
import { EventTopic } from '@/features/events/schema';

export interface NewsArticle {
  id: string;
  topic: EventTopic;
  headline: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
}

export function useNews() {
  return useQuery({
    queryKey: ['news-feed'],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<NewsArticle[]> => {
      try {
        const res = await fetch('/data/news.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.articles || [];
      } catch {
        return [];
      }
    },
  });
}
