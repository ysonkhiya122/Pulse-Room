import { z } from 'zod';

const EnvSchema = z.object({
  VITE_APP_NAME: z.string().default('Pulse Room'),
  VITE_APP_ENV: z.enum(['demo', 'development', 'staging', 'production']).default('demo'),
  VITE_DEMO_MODE: z.string().transform((v) => v === 'true').default('true'),
  VITE_DEFAULT_AGENT_NAME: z.string().default('Nova'),

  // Feature flags
  VITE_FEATURE_LIVEKIT_VOICE: z.string().transform((v) => v === 'true').default('false'),
  VITE_FEATURE_BROWSER_VOICE: z.string().transform((v) => v === 'true').default('true'),
  VITE_FEATURE_WM_BRIEF: z.string().transform((v) => v === 'true').default('true'),
  VITE_FEATURE_NEWS: z.string().transform((v) => v === 'true').default('true'),

  // Public Endpoints
  VITE_USGS_URL: z.string().url().default('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'),
  VITE_EONET_URL: z.string().url().default('https://eonet.gsfc.nasa.gov/api/v3/events'),
  VITE_TOKEN_ENDPOINT: z.string().default('/api/token'),
  VITE_WM_PROXY: z.string().default('/api/wm'),
  VITE_LLM_ENDPOINT: z.string().default('/api/llm'),
});

const parsed = EnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('❌ Configuration Error: Invalid environment variables:', parsed.error.format());
  throw new Error('Invalid environment variables. See console for details.');
}

export const env = parsed.data;
