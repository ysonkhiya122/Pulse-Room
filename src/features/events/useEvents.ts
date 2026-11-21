import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PulseEvent } from './schema';
import { defaultAdapters, fallbackAdapter } from './adapters';
import { logger } from '@/lib/logger';

export interface EventsResult {
  events: PulseEvent[];
  isStale: boolean;
  isLoading: boolean;
  isLiveFeeds: boolean;
  error: Error | null;
  lastUpdated: string;
  toggleLiveFeeds: () => void;
  refetch: () => void;
}

export function useEvents(): EventsResult {
  // Default to live feeds mode so users get genuine real-time planetary events
  const [isLiveFeeds, setIsLiveFeeds] = useState<boolean>(true);

  const query = useQuery({
    queryKey: ['pulse-events', isLiveFeeds],
    staleTime: 60 * 1000, // 60s per Blueprint Section 8
    refetchInterval: isLiveFeeds ? 90 * 1000 : false,
    queryFn: async ({ signal }): Promise<{ events: PulseEvent[]; isStale: boolean }> => {
      if (!isLiveFeeds) {
        const snapshotEvents = await fallbackAdapter.fetch(signal);
        return { events: snapshotEvents, isStale: false };
      }

      try {
        // Query live USGS and NASA EONET adapters concurrently
        const results = await Promise.allSettled(
          defaultAdapters.map((adapter) => adapter.fetch(signal))
        );

        const liveEvents = results.flatMap((res) =>
          res.status === 'fulfilled' ? res.value : []
        );

        const allFailed = results.length > 0 && results.every((res) => res.status === 'rejected');

        // Fail-soft: if live feeds fail or return empty, gracefully fall back to snapshot
        if (allFailed || liveEvents.length === 0) {
          logger.warn('Live adapters returned 0 events or failed; failing soft to snapshot');
          const snapshotEvents = await fallbackAdapter.fetch(signal);
          return { events: snapshotEvents, isStale: true };
        }

        return { events: liveEvents, isStale: false };
      } catch (err) {
        logger.error('Error fetching live event feeds; failing soft', { error: String(err) });
        const snapshotEvents = await fallbackAdapter.fetch(signal);
        return { events: snapshotEvents, isStale: true };
      }
    },
  });

  const toggleLiveFeeds = useCallback(() => {
    setIsLiveFeeds((prev) => !prev);
  }, []);

  return {
    events: query.data?.events ?? [],
    isStale: query.data?.isStale ?? false,
    isLoading: query.isLoading,
    isLiveFeeds,
    error: (query.error as Error) ?? null,
    lastUpdated: new Date().toISOString(),
    toggleLiveFeeds,
    refetch: query.refetch,
  };
}
