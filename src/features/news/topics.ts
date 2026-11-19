import { EventTopic } from '@/features/events/schema';

export interface TopicConfig {
  id: EventTopic;
  label: string;
  color: string;
  badgeBg: string;
  description: string;
  keywords: string[];
}

export const TOPIC_REGISTRY: Record<EventTopic, TopicConfig> = {
  calamities: {
    id: 'calamities',
    label: 'Calamities & Hazards',
    color: '#FF6B6B',
    badgeBg: 'rgba(255, 107, 107, 0.15)',
    description: 'Earthquakes, volcanic eruptions, wildfires, tsunamis, and severe storm systems.',
    keywords: ['earthquake', 'wildfire', 'storm', 'cyclone', 'volcano', 'tsunami', 'flooding'],
  },
  wildlife: {
    id: 'wildlife',
    label: 'Wildlife & Oceans',
    color: '#7CE38B',
    badgeBg: 'rgba(124, 227, 139, 0.15)',
    description: 'Animal migrations, marine ecology, endangered species, and coral reef conservation.',
    keywords: ['migration', 'conservation', 'marine', 'species', 'sanctuary', 'biodiversity'],
  },
  sports: {
    id: 'sports',
    label: 'Sports & Expeditions',
    color: '#A78BFA',
    badgeBg: 'rgba(167, 139, 250, 0.15)',
    description: 'Global ocean regattas, alpine skyraces, polar treks, and extreme athletics.',
    keywords: ['regatta', 'skyrace', 'expedition', 'athletics', 'alpine', 'championship'],
  },
  news: {
    id: 'news',
    label: 'Global Affairs',
    color: '#38E8D0',
    badgeBg: 'rgba(56, 232, 208, 0.15)',
    description: 'International treaties, clean energy grids, and multilateral summits.',
    keywords: ['summit', 'geopolitics', 'energy', 'corridor', 'treaty', 'policy'],
  },
  entertainment: {
    id: 'entertainment',
    label: 'Culture & Media',
    color: '#F472B6',
    badgeBg: 'rgba(244, 114, 182, 0.15)',
    description: 'Volumetric cinema, cultural festivals, spatial audio, and digital art.',
    keywords: ['festival', 'cinema', 'spatial', 'soundscape', 'exhibition', 'media'],
  },
};

export const ALL_TOPIC_IDS: EventTopic[] = [
  'calamities',
  'wildlife',
  'sports',
  'news',
  'entertainment',
];
