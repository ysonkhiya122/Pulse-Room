import React from 'react';
import { PulseInsight } from '@/features/insights/rules';
import { clsx } from 'clsx';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { InfoTooltip } from '@/components/atoms/InfoTooltip';

export interface InsightCardProps {
  insight: PulseInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const urgencyStyles = {
    low: 'border-border/70 hover:border-border-active',
    medium: 'border-topic-storm/40 hover:border-topic-storm/70',
    high: 'border-topic-calamity/40 hover:border-topic-calamity/80',
  };

  const getIcon = () => {
    switch (insight.urgency) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-topic-calamity flex-shrink-0" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4 text-topic-storm flex-shrink-0" />;
      default:
        return <CheckCircle className="w-4 h-4 text-topic-wildlife flex-shrink-0" />;
    }
  };

  const getExplanation = () => {
    switch (insight.type) {
      case 'seismic_spike':
        return {
          title: 'Seismic Anomaly Explanation',
          description: 'Calculated by comparing the ratio of magnitude ≥6.0 earthquakes over the last 24 hours against rolling 30-day global baseline telemetry.',
          source: 'USGS Real-time GeoJSON Feeds',
          baseline: 'Historical Average: ~3-4 M≥6.0 quakes per week worldwide',
        };
      case 'wildfire_front':
        return {
          title: 'Thermal Anomaly Tracking',
          description: 'Infrared radiometric satellite passes detect persistent high-temperature thermal clusters characteristic of active wildfire fronts.',
          source: 'NASA EONET v3 / MODIS',
          baseline: 'Thermal confidence threshold ≥80%',
        };
      case 'storm_alert':
        return {
          title: 'Atmospheric Depression Monitoring',
          description: 'Tracks tropical storm and cyclone centers with sustained winds exceeding 65 km/h.',
          source: 'NASA EONET & Open-Meteo',
          baseline: 'Saffir-Simpson / JMA Category Scales',
        };
      default:
        return {
          title: 'Planetary Telemetry Baseline',
          description: 'Aggregated cross-discipline telemetry indicates nominal baseline stability across tectonic, atmospheric, and ocean sensor networks.',
          source: 'Pulse Room Unified Intelligence Layer',
          baseline: 'Within normal 1-sigma standard deviation',
        };
    }
  };

  const explainer = getExplanation();

  return (
    <div
      className={clsx(
        'glass-card rounded-card p-3.5 flex flex-col justify-between transition-all duration-200 border',
        urgencyStyles[insight.urgency]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h4 className="text-xs font-semibold text-text">{insight.title}</h4>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-panel-subtle text-accent border border-border">
            {insight.metric}
          </span>
          <InfoTooltip
            title={explainer.title}
            description={explainer.description}
            source={explainer.source}
            baseline={explainer.baseline}
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-text-muted leading-relaxed line-clamp-2">
        {insight.description}
      </p>
    </div>
  );
};
