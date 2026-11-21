import { describe, it, expect } from 'vitest';
import { degreesToCompass, classifyUsAqi } from './open-meteo';

describe('open-meteo atmospheric telemetry utilities', () => {
  it('converts degrees to accurate 16-point compass directions', () => {
    expect(degreesToCompass(0)).toBe('N');
    expect(degreesToCompass(360)).toBe('N');
    expect(degreesToCompass(90)).toBe('E');
    expect(degreesToCompass(180)).toBe('S');
    expect(degreesToCompass(270)).toBe('W');
    expect(degreesToCompass(45)).toBe('NE');
    expect(degreesToCompass(68)).toBe('ENE');
    expect(degreesToCompass(210)).toBe('SSW');
  });

  it('classifies US AQI into standard EPA health categories and colors', () => {
    const good = classifyUsAqi(25);
    expect(good.category).toBe('Good');
    expect(good.color).toBe('#10B981');

    const moderate = classifyUsAqi(75);
    expect(moderate.category).toBe('Moderate');
    expect(moderate.color).toBe('#F59E0B');

    const unhealthySensitive = classifyUsAqi(120);
    expect(unhealthySensitive.category).toBe('Unhealthy for Sensitive');

    const unhealthy = classifyUsAqi(175);
    expect(unhealthy.category).toBe('Unhealthy');

    const hazardous = classifyUsAqi(350);
    expect(hazardous.category).toBe('Hazardous');
  });
});
