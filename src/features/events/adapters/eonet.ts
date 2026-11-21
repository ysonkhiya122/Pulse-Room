import { EventAdapter, PulseEvent } from '../schema';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { fetchWithTimeout } from '@/lib/http';

export class EonetAdapter implements EventAdapter {
  id = 'eonet';
  refetchMs = 360000; // 6 mins (per Blueprint 5-10m)

  async fetch(signal: AbortSignal): Promise<PulseEvent[]> {
    try {
      const url = `${env.VITE_EONET_URL}?status=open&days=10`;
      const res = await fetchWithTimeout(url, { signal, timeoutMs: 8000 });

      if (!res.ok) {
        throw new Error(`EONET HTTP ${res.status}`);
      }

      const data = await res.json();
      const events: PulseEvent[] = [];

      for (const item of data.events || []) {
        const category = item.categories?.[0]?.id || 'wildfires';
        const isStorm = category.toLowerCase().includes('storm') || category.toLowerCase().includes('cyclone');
        const isVolcano = category.toLowerCase().includes('volcano');
        const kind = isStorm ? 'storm' : isVolcano ? 'volcano' : 'wildfire';

        // Most recent geometry coordinate
        const geom = item.geometry?.[item.geometry.length - 1];
        if (!geom?.coordinates || geom.coordinates.length < 2) continue;

        const lng = geom.coordinates[0];
        const lat = geom.coordinates[1];

        events.push({
          id: `eonet-${item.id}`,
          source: 'eonet',
          topic: 'calamities',
          kind,
          title: item.title,
          summary: `NASA EONET classified hazard category: ${item.categories?.[0]?.title || category}. Continuous satellite telemetry observation.`,
          lat,
          lng,
          severity: isStorm ? 4 : isVolcano ? 4 : 3,
          time: new Date(geom.date || Date.now()).toISOString(),
          url: item.link || `https://eonet.gsfc.nasa.gov/api/v3/events/${item.id}`,
        });
      }

      logger.info(`NASA EONET Adapter successfully ingested ${events.length} live natural hazard events.`);
      return events;
    } catch (err) {
      logger.warn('NASA EONET adapter fetch failed; failing soft', { error: String(err) });
      throw err;
    }
  }
}
