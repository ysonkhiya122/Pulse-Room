import { describe, it, expect } from 'vitest';
import { EventSchema } from './schema';

describe('EventSchema (Appendix A)', () => {
  it('validates a compliant PulseEvent object', () => {
    const validData = {
      id: 'usgs-event-1',
      source: 'usgs',
      topic: 'calamities',
      kind: 'earthquake',
      title: 'M 5.4 Undersea Tremor',
      summary: 'Depth of 10 km',
      lat: 34.5,
      lng: 139.8,
      severity: 3,
      time: '2026-11-14T08:00:00.000Z',
      url: 'https://earthquake.usgs.gov',
    };

    const result = EventSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects events with invalid latitude/longitude or out-of-range severity', () => {
    const invalidCoords = {
      id: 'bad-coords',
      source: 'usgs',
      topic: 'calamities',
      kind: 'earthquake',
      title: 'Invalid coordinates',
      lat: 95.0, // > 90
      lng: 0.0,
      severity: 3,
      time: '2026-11-14T08:00:00.000Z',
    };

    const result = EventSchema.safeParse(invalidCoords);
    expect(result.success).toBe(false);

    const invalidSeverity = {
      id: 'bad-sev',
      source: 'usgs',
      topic: 'calamities',
      kind: 'earthquake',
      title: 'Invalid severity',
      lat: 0.0,
      lng: 0.0,
      severity: 7, // max is 5
      time: '2026-11-14T08:00:00.000Z',
    };

    expect(EventSchema.safeParse(invalidSeverity).success).toBe(false);
  });
});
