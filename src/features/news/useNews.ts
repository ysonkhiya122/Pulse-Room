import { useQuery } from '@tanstack/react-query';
import { EventTopic } from '@/features/events/schema';
import { fetchWithTimeout } from '@/lib/http';
import { logger } from '@/lib/logger';

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
  return useQuery<NewsArticle[]>({
    queryKey: ['news-live-feed'],
    staleTime: 5 * 60 * 1000,
    queryFn: async ({ signal }): Promise<NewsArticle[]> => {
      try {
        // Query live Spaceflight News API (live NASA, ESA, SpaceNews dispatches)
        const sfnUrl = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=6';
        const res = await fetchWithTimeout(sfnUrl, { signal, timeoutMs: 5000 });

        if (res.ok) {
          const data = await res.json();
          const liveArticles: NewsArticle[] = [];

          for (const item of data.results || []) {
            liveArticles.push({
              id: `live-sfn-${item.id}`,
              topic: 'news',
              headline: item.title,
              source: item.news_site || 'NASA / Planetary Space Network',
              url: item.url,
              publishedAt: item.published_at || new Date().toISOString(),
              summary: item.summary ? item.summary.replace(/<[^>]*>?/gm, '').substring(0, 400) : 'Live scientific news dispatch.',
            });
          }

          if (liveArticles.length > 0) {
            return liveArticles;
          }
        }
        throw new Error('Spaceflight news returned empty payload');
      } catch (err) {
        logger.warn('Live news API fetch failed; serving verified fallback news', { error: String(err) });
        try {
          const fallbackRes = await fetch('/data/news.json', { signal });
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            return data.articles || [];
          }
        } catch {
          // ignore
        }
        return [
          {
            id: 'fallback-sierra-snow',
            topic: 'news',
            headline: 'NASA Earth Observatory: Sierra Snowpack Dynamics and Water Resources',
            source: 'NASA Earth Observatory',
            url: 'https://science.nasa.gov/earth/earth-observatory/sierra-snow-season-spins-up/',
            publishedAt: new Date().toISOString(),
            summary: 'Satellite imaging measures early-season alpine snow water equivalents across the Sierra Nevada watershed basins.',
          },
        ];
      }
    },
  });
}
