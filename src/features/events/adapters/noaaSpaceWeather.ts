import { EventAdapter, PulseEvent } from '../schema';
import { fetchWithTimeout } from '@/lib/http';
import { logger } from '@/lib/logger';

interface NoaaAlertItem {
  product_id: string;
  issue_datetime: string;
  message: string;
}

export class NoaaSpaceWeatherAdapter implements EventAdapter {
  id = 'noaa-space-weather';
  refetchMs = 300000; // 5 mins

  async fetch(signal: AbortSignal): Promise<PulseEvent[]> {
    try {
      const url = 'https://services.swpc.noaa.gov/products/alerts.json';
      const res = await fetchWithTimeout(url, { signal, timeoutMs: 6000 });

      if (!res.ok) {
        throw new Error(`NOAA SWPC HTTP ${res.status}`);
      }

      const alerts: NoaaAlertItem[] = await res.json();
      const events: PulseEvent[] = [];

      // High-latitude auroral and geomagnetic observation stations
      const stations = [
        { name: 'Fairbanks Geomagnetic Observatory, Alaska', lat: 64.84, lng: -147.72 },
        { name: 'Tromsø Auroral Observatory, Norway', lat: 69.65, lng: 18.96 },
        { name: 'Kiruna Atmospheric & Space Center, Sweden', lat: 67.85, lng: 20.22 },
        { name: 'NOAA Space Weather Prediction Center, Boulder CO', lat: 40.01, lng: -105.27 },
        { name: 'Sodankylä Geophysical Observatory, Finland', lat: 67.42, lng: 26.63 },
        { name: 'Mawson Polar Station, Antarctica', lat: -67.60, lng: 62.87 },
      ];

      // Take latest 5 significant alerts
      const topAlerts = alerts.slice(0, 6);

      for (let i = 0; i < topAlerts.length; i++) {
        const alert = topAlerts[i]!;
        const station = stations[i % stations.length]!;

        const lines = alert.message.split('\n').map((l) => l.trim()).filter(Boolean);
        const headerLine = lines.find((l) =>
          l.startsWith('WARNING:') ||
          l.startsWith('ALERT:') ||
          l.startsWith('WATCH:') ||
          l.startsWith('CONTINUED ALERT:') ||
          l.startsWith('EXTENDED WARNING:')
        ) || lines[0] || 'Space Weather Alert';

        const impactLine = lines.find((l) => l.startsWith('Potential Impacts:') || l.includes('Aurora') || l.includes('Induced Currents'));

        // Determine severity from alert code
        let severity = 2;
        if (alert.product_id.includes('K05') || alert.product_id.includes('G2')) {
          severity = 3;
        } else if (alert.product_id.includes('K06') || alert.product_id.includes('G3')) {
          severity = 4;
        } else if (alert.product_id.includes('G4') || alert.product_id.includes('G5')) {
          severity = 5;
        }

        const title = `NOAA SWPC: ${headerLine.replace(/^(WARNING:|ALERT:|WATCH:|CONTINUED ALERT:|EXTENDED WARNING:)\s*/i, '')}`;
        const summary = impactLine
          ? `${impactLine} Logged at ${station.name}. Valid from ${alert.issue_datetime} UTC.`
          : `Geomagnetic and solar radiation telemetry logged at ${station.name} by NOAA Space Weather Prediction Center.`;

        // Format ISO datetime
        let isoTime = new Date().toISOString();
        try {
          if (alert.issue_datetime) {
            isoTime = new Date(alert.issue_datetime.replace(' ', 'T') + 'Z').toISOString();
          }
        } catch {
          // fallback to now
        }

        events.push({
          id: `noaa-${alert.product_id}-${i}-${alert.issue_datetime.slice(0, 10)}`,
          source: 'noaa',
          topic: severity >= 3 ? 'calamities' : 'news',
          kind: 'geomagnetic_telemetry',
          title: title.length > 180 ? title.substring(0, 177) + '...' : title,
          summary: summary.length > 550 ? summary.substring(0, 547) + '...' : summary,
          lat: station.lat,
          lng: station.lng,
          severity,
          time: isoTime,
          url: 'https://www.swpc.noaa.gov',
        });
      }

      logger.info(`NOAA Space Weather Adapter ingested ${events.length} live space weather alerts.`);
      return events;
    } catch (err) {
      logger.warn('NOAA Space Weather adapter fetch failed; failing soft', { error: String(err) });
      return [];
    }
  }
}
