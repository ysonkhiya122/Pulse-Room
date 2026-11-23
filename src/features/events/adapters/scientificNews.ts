import { EventAdapter, PulseEvent } from '../schema';
import { logger } from '@/lib/logger';

export class ScientificNewsAdapter implements EventAdapter {
  id = 'scientific-news';
  refetchMs = 300000; // 5 mins

  async fetch(signal: AbortSignal): Promise<PulseEvent[]> {
    try {
      const res = await fetch('/data/news.json', { signal });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const events: PulseEvent[] = [];

      // Known geographical coordinate mapping for verified regional dispatches
      const coordinatesByTopic: Record<string, { lat: number; lng: number }> = {
        'nasa-science-sierra-snow-2026': { lat: 37.86, lng: -119.53 }, // Sierra Nevada / Yosemite
        'usgs-seismic-pacific-advisory': { lat: 35.12, lng: 141.25 }, // Japan Trench
        'noaa-ocean-coral-telemetry': { lat: -0.65, lng: -90.45 },     // Galápagos Marine Reserve
        'world-monitor-grid-transition': { lat: 48.85, lng: 2.35 },    // Paris / EU Energy Dispatch
        'imoca-ocean-regatta-telemetry': { lat: -45.20, lng: 120.40 }, // Southern Ocean Foiling Track
        'cannes-spatial-media-2026': { lat: 43.55, lng: 7.01 },       // Cannes
      };

      for (const item of data.articles || []) {
        const coords = coordinatesByTopic[item.id] || { lat: 40.0, lng: -3.0 };

        events.push({
          id: `news-${item.id}`,
          source: item.source.toLowerCase().includes('world monitor') ? 'wm' : 'news',
          topic: item.topic,
          kind: item.topic === 'sports' ? 'expedition' : item.topic === 'entertainment' ? 'media_showcase' : 'scientific_dispatch',
          title: item.headline,
          summary: item.summary,
          lat: coords.lat,
          lng: coords.lng,
          severity: item.topic === 'calamities' ? 3 : item.topic === 'news' ? 2 : 1,
          time: item.publishedAt || new Date().toISOString(),
          url: item.url,
        });
      }

      return events;
    } catch (err) {
      logger.warn('Scientific news adapter fetch failed; failing soft', { error: String(err) });
      return [];
    }
  }
}
