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
    color: '#F43F5E',
    badgeBg: 'rgba(244, 63, 94, 0.12)',
    description: 'Earthquakes, volcanic eruptions, wildfires, tsunamis, and severe storm systems monitored by USGS and NASA EONET.',
    keywords: ['earthquake', 'wildfire', 'storm', 'cyclone', 'volcano', 'tsunami', 'flooding'],
  },
  wildlife: {
    id: 'wildlife',
    label: 'Wildlife & Oceans',
    color: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    description: 'Animal migrations, marine ecology, endangered species, and coral reef conservation research.',
    keywords: ['migration', 'conservation', 'marine', 'species', 'sanctuary', 'biodiversity'],
  },
  sports: {
    id: 'sports',
    label: 'Sports & Expeditions',
    color: '#818CF8',
    badgeBg: 'rgba(129, 140, 248, 0.12)',
    description: 'Global ocean regattas, alpine skyraces, polar expeditions, and extreme endurance events.',
    keywords: ['regatta', 'skyrace', 'expedition', 'athletics', 'alpine', 'championship'],
  },
  news: {
    id: 'news',
    label: 'Global Affairs',
    color: '#06B6D4',
    badgeBg: 'rgba(6, 182, 212, 0.12)',
    description: 'Multilateral climate summits, cross-border clean energy corridors, and international space research.',
    keywords: ['summit', 'geopolitics', 'energy', 'corridor', 'treaty', 'policy'],
  },
  entertainment: {
    id: 'entertainment',
    label: 'Culture & Media',
    color: '#EC4899',
    badgeBg: 'rgba(236, 72, 153, 0.12)',
    description: 'Volumetric cinema, cultural festivals, spatial audio, and digital art exhibitions.',
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
