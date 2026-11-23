import { z } from 'zod';

export const EventTopicSchema = z.enum([
  'calamities',
  'wildlife',
  'sports',
  'news',
  'entertainment',
]);

export type EventTopic = z.infer<typeof EventTopicSchema>;

export const EventSourceSchema = z.enum([
  'usgs',
  'eonet',
  'gdacs',
  'gbif',
  'noaa',
  'news',
  'wm',
]);

export type EventSource = z.infer<typeof EventSourceSchema>;

export const EventSchema = z.object({
  id: z.string(),
  source: EventSourceSchema,
  topic: EventTopicSchema,
  kind: z.string(),
  title: z.string().max(200),
  summary: z.string().max(600).optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  severity: z.number().int().min(1).max(5),
  time: z.string().datetime(),
  url: z.string().url().optional(),
});

export type PulseEvent = z.infer<typeof EventSchema>;

export interface EventAdapter {
  id: string;
  refetchMs: number;
  fetch(signal: AbortSignal): Promise<PulseEvent[]>;
}
