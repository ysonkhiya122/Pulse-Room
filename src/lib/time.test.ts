import { describe, it, expect } from 'vitest';
import { formatRelativeTime, isWithinHours, formatTimeUTC } from './time';

describe('time utilities (src/lib/time.ts)', () => {
  it('formats recent timestamps into relative minutes/hours', () => {
    const justNow = new Date().toISOString();
    expect(formatRelativeTime(justNow)).toBe('Just now');

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(formatRelativeTime(tenMinutesAgo)).toBe('10m ago');

    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago');
  });

  it('correctly filters events within the replay window', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
    const tenHoursAgo = new Date(Date.now() - 10 * 3600 * 1000).toISOString();

    expect(isWithinHours(twoHoursAgo, 6)).toBe(true);
    expect(isWithinHours(tenHoursAgo, 6)).toBe(false);
    expect(isWithinHours(tenHoursAgo, 24)).toBe(true);
  });

  it('formats time to UTC string', () => {
    const iso = '2026-11-14T08:15:00.000Z';
    expect(formatTimeUTC(iso)).toBe('2026-11-14 08:15:00 UTC');
  });
});
