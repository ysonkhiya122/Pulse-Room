export const APP_NAME = 'Pulse Room';
export const DEFAULT_AGENT_NAME = 'Nova';

export const REPLAY_MIN_HOURS = 1;
export const REPLAY_MAX_HOURS = 24;
export const REPLAY_DEFAULT_HOURS = 24;

export const TOPIC_COLORS = {
  calamities: '#FF6B6B',
  wildlife: '#7CE38B',
  sports: '#A78BFA',
  news: '#38E8D0',
  entertainment: '#F472B6',
} as const;

export const TOPIC_LABELS = {
  calamities: 'Calamities & Hazards',
  wildlife: 'Wildlife & Oceans',
  sports: 'Sports & Expeditions',
  news: 'Global Affairs',
  entertainment: 'Culture & Media',
} as const;

export const SEVERITY_LEVELS = {
  1: 'Low impact / Routine',
  2: 'Noteworthy',
  3: 'Substantial notice',
  4: 'Major regional event',
  5: 'Critical planetary scale',
} as const;
