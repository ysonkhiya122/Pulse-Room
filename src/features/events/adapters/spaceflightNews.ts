import { EventAdapter, PulseEvent } from '../schema';
import { fetchWithTimeout } from '@/lib/http';
import { logger } from '@/lib/logger';

interface SfnArticle {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
}

export class SpaceflightNewsAdapter implements EventAdapter {
  id = 'spaceflight-news';
  refetchMs = 300000; // 5 mins

  async fetch(signal: AbortSignal): Promise<PulseEvent[]> {
    try {
      const url = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=8';
      const res = await fetchWithTimeout(url, { signal, timeoutMs: 6000 });

      if (!res.ok) {
        throw new Error(`Spaceflight News HTTP ${res.status}`);
      }

      const data = await res.json();
      const events: PulseEvent[] = [];

      // Primary global scientific spaceports & earth observation institutes
      const centers = [
        { name: 'KSC / Cape Canaveral', lat: 28.57, lng: -80.64 },
        { name: 'ESA Kourou Spaceport', lat: 5.23, lng: -52.76 },
        { name: 'Tokyo / JAXA Aerospace', lat: 35.68, lng: 139.76 },
        { name: 'Vandenberg Space Base', lat: 34.74, lng: -120.57 },
        { name: 'Paris / ESA HQ', lat: 48.85, lng: 2.30 },
        { name: 'Sydney / Australian Space Agency', lat: -33.87, lng: 151.21 },
        { name: 'Andøya Spaceport / Arctic', lat: 69.29, lng: 16.02 },
        { name: 'Houston Johnson Space Center', lat: 29.56, lng: -95.09 },
      ];

      for (let i = 0; i < (data.results as SfnArticle[]).length; i++) {
        const item = data.results[i]!;
        const center = centers[i % centers.length]!;

        events.push({
          id: `sfn-${item.id}`,
          source: 'news',
          topic: 'news',
          kind: 'planetary_science',
          title: item.title,
          summary: item.summary ? item.summary.replace(/<[^>]*>?/gm, '').substring(0, 500) : 'Live planetary observation dispatch.',
          lat: center.lat,
          lng: center.lng,
          severity: 2,
          time: item.published_at ? new Date(item.published_at).toISOString() : new Date().toISOString(),
          url: item.url,
        });
      }

      logger.info(`Spaceflight News Adapter ingested ${events.length} live planetary science dispatches.`);
      return events;
    } catch (err) {
      logger.warn('Spaceflight News adapter fetch failed; failing soft', { error: String(err) });
      return [];
    }
  }
}
