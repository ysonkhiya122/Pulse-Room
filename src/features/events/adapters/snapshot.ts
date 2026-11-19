import { EventAdapter, EventSchema, PulseEvent } from '../schema';
import { logger } from '@/lib/logger';

export class SnapshotAdapter implements EventAdapter {
  id = 'snapshot';
  refetchMs = 300000; // 5 mins

  async fetch(signal: AbortSignal): Promise<PulseEvent[]> {
    try {
      const response = await fetch('/data/snapshot.json', { signal });
      if (!response.ok) {
        throw new Error(`Failed to load snapshot.json: HTTP ${response.status}`);
      }
      const data = await response.json();
      const validEvents: PulseEvent[] = [];

      for (const item of data.events || []) {
        const parsed = EventSchema.safeParse(item);
        if (parsed.success) {
          validEvents.push(parsed.data);
        } else {
          logger.warn(`Dropping invalid snapshot event: ${item?.id}`, { error: parsed.error });
        }
      }

      return validEvents;
    } catch (err) {
      logger.error('Snapshot adapter fetch failed', { error: String(err) });
      return [];
    }
  }
}
