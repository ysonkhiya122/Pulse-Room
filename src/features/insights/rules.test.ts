import { describe, it, expect } from 'vitest';
import { computeInsights } from './rules';
import { PulseEvent } from '@/features/events/schema';

describe('computeInsights (Section 8 & 17)', () => {
  const sampleEvents: PulseEvent[] = [
    {
      id: 'test-1',
      source: 'usgs',
      topic: 'calamities',
      kind: 'earthquake',
      title: 'M 6.5 Deep Subduction Tremor',
      summary: 'Test summary',
      lat: 35.0,
      lng: 140.0,
      severity: 4,
      time: '2026-11-14T10:00:00.000Z',
    },
    {
      id: 'test-2',
      source: 'eonet',
      topic: 'calamities',
      kind: 'wildfire',
      title: 'Active Foothills Brush Fire',
      summary: 'Brush fire active',
      lat: 34.0,
      lng: -118.0,
      severity: 3,
      time: '2026-11-14T08:00:00.000Z',
    },
    {
      id: 'test-3',
      source: 'news',
      topic: 'wildlife',
      kind: 'migration',
      title: 'Serengeti Herd Crossing',
      lat: -2.0,
      lng: 35.0,
      severity: 2,
      time: '2026-11-14T06:00:00.000Z',
    },
  ];

  it('detects high-severity seismic events and produces seismic_spike insight', () => {
    const insights = computeInsights(sampleEvents);
    const seismic = insights.find((i) => i.type === 'seismic_spike');
    expect(seismic).toBeDefined();
    expect(seismic?.urgency).toBe('high');
    expect(seismic?.title).toContain('Elevated Pacific Rim Seismicity');
  });

  it('detects active wildfires and flags urgency', () => {
    const insights = computeInsights(sampleEvents);
    const fire = insights.find((i) => i.type === 'wildfire_front');
    expect(fire).toBeDefined();
    expect(fire?.urgency).toBe('high');
  });

  it('returns baseline stability when no major events occur', () => {
    const lowEvents: PulseEvent[] = [
      {
        id: 'test-low',
        source: 'usgs',
        topic: 'calamities',
        kind: 'earthquake',
        title: 'M 2.8 Microquake',
        lat: 37.0,
        lng: -122.0,
        severity: 1,
        time: '2026-11-14T11:00:00.000Z',
      },
    ];

    const insights = computeInsights(lowEvents);
    const baseline = insights.find((i) => i.type === 'global_stability');
    expect(baseline).toBeDefined();
    expect(baseline?.urgency).toBe('low');
  });
});
