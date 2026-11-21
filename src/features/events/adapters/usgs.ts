import { EventAdapter, PulseEvent } from '../schema';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { fetchWithTimeout } from '@/lib/http';

export class UsgsAdapter implements EventAdapter {
  id = 'usgs';
  refetchMs = 90000; // 90 seconds (per Blueprint 60-120s)

  async fetch(signal: AbortSignal): Promise<PulseEvent[]> {
    try {
      const res = await fetchWithTimeout(env.VITE_USGS_URL, {
        signal,
        timeoutMs: 7000,
      });

      if (!res.ok) {
        throw new Error(`USGS HTTP ${res.status}`);
      }

      const geoJson = await res.json();
      const events: PulseEvent[] = [];

      for (const feature of geoJson.features || []) {
        const mag = feature.properties?.mag ?? 2.5;
        // Severity mapping 1 to 5 based on Richter magnitude
        let severity = 1;
        if (mag >= 7.0) severity = 5;
        else if (mag >= 6.0) severity = 4;
        else if (mag >= 4.5) severity = 3;
        else if (mag >= 3.5) severity = 2;

        const coords = feature.geometry?.coordinates;
        if (!coords || coords.length < 2) continue;

        const lng = coords[0];
        const lat = coords[1];

        events.push({
          id: `usgs-${feature.id}`,
          source: 'usgs',
          topic: 'calamities',
          kind: 'earthquake',
          title: feature.properties?.title || `M ${mag} Earthquake`,
          summary: `Magnitude ${mag} detected at depth of ${coords[2] ?? 10} km. USGS Seismological Status: ${feature.properties?.status || 'reviewed'}.`,
          lat,
          lng,
          severity,
          time: new Date(feature.properties?.time || Date.now()).toISOString(),
          url: feature.properties?.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${feature.id}`,
        });
      }

      logger.info(`USGS Adapter successfully ingested ${events.length} live seismic events.`);
      return events;
    } catch (err) {
      logger.warn('USGS adapter fetch failed; failing soft to fallback', { error: String(err) });
      throw err;
    }
  }
}
