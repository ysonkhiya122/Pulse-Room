import { EventAdapter, PulseEvent } from '../schema';
import { fetchWithTimeout } from '@/lib/http';
import { logger } from '@/lib/logger';

interface GdacsFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    eventid: number;
    eventname: string;
    eventtype: string;
    name: string;
    description: string;
    htmldescription: string;
    alertlevel: string;
    fromdate?: string;
    todate?: string;
    url?: {
      report?: string;
      details?: string;
    };
  };
}

export class GdacsAdapter implements EventAdapter {
  id = 'gdacs';
  refetchMs = 300000; // 5 mins

  async fetch(signal: AbortSignal): Promise<PulseEvent[]> {
    try {
      const url = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventtypes=EQ,TC,FL,VO&status=ongoing';
      const res = await fetchWithTimeout(url, { signal, timeoutMs: 6000 });

      if (!res.ok) {
        throw new Error(`GDACS HTTP ${res.status}`);
      }

      const data = await res.json();
      const events: PulseEvent[] = [];

      for (const feat of (data.features as GdacsFeature[]) || []) {
        const coords = feat.geometry?.coordinates;
        if (!coords || coords.length < 2) continue;

        const lng = coords[0];
        const lat = coords[1];
        if (typeof lat !== 'number' || typeof lng !== 'number') continue;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) continue;

        const p = feat.properties;
        const alertLevel = (p.alertlevel || '').toLowerCase();
        const severity = alertLevel.includes('red') ? 5 : alertLevel.includes('orange') ? 4 : 3;

        const typeMap: Record<string, string> = {
          TC: 'tropical_cyclone',
          EQ: 'earthquake',
          FL: 'flood',
          VO: 'volcano',
          DR: 'drought',
        };

        const kind = typeMap[p.eventtype] || 'hazard';
        const cleanSummary = (p.description || p.htmldescription || 'Monitored international humanitarian emergency.')
          .replace(/<[^>]*>?/gm, '')
          .substring(0, 500);

        events.push({
          id: `gdacs-${p.eventid}-${p.eventtype}`,
          source: 'gdacs',
          topic: 'calamities',
          kind,
          title: `UN GDACS Alert: ${p.name || p.eventname}`,
          summary: cleanSummary,
          lat: Math.round(lat * 100) / 100,
          lng: Math.round(lng * 100) / 100,
          severity,
          time: p.fromdate ? new Date(p.fromdate).toISOString() : new Date().toISOString(),
          url: p.url?.report || `https://www.gdacs.org/report.aspx?eventtype=${p.eventtype}&eventid=${p.eventid}`,
        });
      }

      logger.info(`GDACS Adapter successfully ingested ${events.length} ongoing multi-hazard events.`);
      return events.slice(0, 15); // Top 15 active global events
    } catch (err) {
      logger.warn('GDACS adapter live query failed; failing soft', { error: String(err) });
      return [];
    }
  }
}
