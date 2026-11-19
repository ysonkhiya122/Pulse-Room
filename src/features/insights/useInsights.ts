import { useMemo } from 'react';
import { PulseEvent } from '@/features/events/schema';
import { computeInsights, PulseInsight } from './rules';

export function useInsights(events: PulseEvent[]): PulseInsight[] {
  return useMemo(() => computeInsights(events), [events]);
}
