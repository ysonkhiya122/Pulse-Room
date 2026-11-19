import { useQuery } from '@tanstack/react-query';
import { PulseEvent } from './schema';
import { defaultAdapters, fallbackAdapter } from './adapters';
import { env } from '@/config/env';

export interface EventsResult {
  events: PulseEvent[];
  isStale: boolean;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: string;
}

export function useEvents(): EventsResult {
  const query = useQuery({
    queryKey: ['pulse-events', env.VITE_DEMO_MODE],
    staleTime: 60 * 1000, // 60s per Section 8
    refetchInterval: env.VITE_DEMO_MODE ? false : 90 * 1000,
    queryFn: async ({ signal }): Promise<{ events: PulseEvent[]; isStale: boolean }> => {
      // In demo mode, load directly from fallback snapshot
      if (env.VITE_DEMO_MODE) {
        const snapshotEvents = await fallbackAdapter.fetch(signal);
        return { events: snapshotEvents, isStale: false };
      }

      // Live mode: query adapters concurrently via Promise.allSettled
      const results = await Promise.allSettled(
        defaultAdapters.map((adapter) => adapter.fetch(signal))
      );

      const liveEvents = results.flatMap((res) =>
        res.status === 'fulfilled' ? res.value : []
      );

      const allFailed = results.length > 0 && results.every((res) => res.status === 'rejected');

      if (allFailed || liveEvents.length === 0) {
        // Fail-soft: fallback to snapshot
        const snapshotEvents = await fallbackAdapter.fetch(signal);
        return { events: snapshotEvents, isStale: true };
      }

      return { events: liveEvents, isStale: false };
    },
  });

  return {
    events: query.data?.events ?? [],
    isStale: query.data?.isStale ?? false,
    isLoading: query.isLoading,
    error: (query.error as Error) ?? null,
    lastUpdated: new Date().toISOString(),
  };
}
