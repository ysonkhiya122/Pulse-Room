import { env } from './env';

export const flags = {
  isDemoMode: env.VITE_DEMO_MODE,
  isLiveKitVoiceEnabled: env.VITE_FEATURE_LIVEKIT_VOICE,
  isBrowserVoiceEnabled: env.VITE_FEATURE_BROWSER_VOICE,
  isWorldBriefEnabled: env.VITE_FEATURE_WM_BRIEF,
  isNewsEnabled: env.VITE_FEATURE_NEWS,
} as const;

export type FeatureFlags = typeof flags;
