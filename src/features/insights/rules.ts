import { PulseEvent } from '@/features/events/schema';

export interface PulseInsight {
  id: string;
  type: 'seismic_spike' | 'wildfire_front' | 'storm_alert' | 'wildlife_activity' | 'global_stability';
  title: string;
  description: string;
  metric: string;
  trend: 'up' | 'down' | 'neutral';
  urgency: 'low' | 'medium' | 'high';
}

export function computeInsights(events: PulseEvent[]): PulseInsight[] {
  const insights: PulseInsight[] = [];

  const quakes = events.filter((e) => e.kind === 'earthquake');
  const wildfires = events.filter((e) => e.kind === 'wildfire');
  const storms = events.filter((e) => e.kind === 'storm');
  const wildlife = events.filter((e) => e.topic === 'wildlife');

  // Seismic analysis
  const majorQuakes = quakes.filter((q) => q.severity >= 4);
  if (majorQuakes.length > 0) {
    insights.push({
      id: 'insight-seismic-noteworthy',
      type: 'seismic_spike',
      title: 'Elevated Pacific Rim Seismicity',
      description: `${majorQuakes.length} magnitude ≥6.0 event(s) registered in the last 24h. Subduction zone stress monitoring active.`,
      metric: `${quakes.length} total events`,
      trend: 'up',
      urgency: 'high',
    });
  } else {
    insights.push({
      id: 'insight-seismic-baseline',
      type: 'global_stability',
      title: 'Planetary Seismic Baseline Normal',
      description: 'Global plate boundary dissipation remains within nominal 30-day statistical bands.',
      metric: `${quakes.length} events logged`,
      trend: 'neutral',
      urgency: 'low',
    });
  }

  // Atmospheric / Storm analysis
  if (storms.length > 0) {
    insights.push({
      id: 'insight-storm-alert',
      type: 'storm_alert',
      title: 'Cyclonic Weather Systems Active',
      description: `${storms.length} major tropical storm/cyclone front tracked across Western Pacific and Indian Ocean basins.`,
      metric: `${storms.length} storm tracks`,
      trend: 'up',
      urgency: 'medium',
    });
  }

  // Ecological / Wildlife monitoring
  if (wildlife.length > 0) {
    insights.push({
      id: 'insight-wildlife-activity',
      type: 'wildlife_activity',
      title: 'Key Ecological Migrations Observed',
      description: 'Active seasonal migration corridors and newly documented deep-water marine habitats confirmed.',
      metric: `${wildlife.length} key sightings`,
      trend: 'neutral',
      urgency: 'low',
    });
  }

  // Thermal / Wildfire activity
  if (wildfires.length > 0) {
    insights.push({
      id: 'insight-wildfire-front',
      type: 'wildfire_front',
      title: 'Wildfire Thermal Signatures',
      description: `${wildfires.length} active high-intensity fire cluster(s) tracked by infrared satellite passes.`,
      metric: `${wildfires.length} active fronts`,
      trend: 'up',
      urgency: 'high',
    });
  }

  return insights;
}
