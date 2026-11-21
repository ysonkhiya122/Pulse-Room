import React from 'react';
import { PulseEvent } from '@/features/events/schema';
import { TOPIC_REGISTRY } from '@/features/news/topics';
import { Badge, Button, InfoTooltip } from '@/components/atoms';
import { formatTimeUTC, formatRelativeTime } from '@/lib/time';
import { useAtmosphericTelemetry } from '@/features/weather';
import { Volume2, ExternalLink, MapPin, Wind, Activity, X } from 'lucide-react';

export interface StoryCardProps {
  event: PulseEvent | null;
  onListen: (event: PulseEvent) => void;
  onClose?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ event, onListen, onClose }) => {
  // Fetch real atmospheric data (Wind Speed & AQI) for this event's coordinates
  const { data: atmospheric } = useAtmosphericTelemetry(
    event ? event.lat : 0,
    event ? event.lng : 0
  );

  if (!event) {
    return (
      <div className="glass-card rounded-panel border border-border p-5 flex flex-col items-center justify-center text-center min-h-[240px]">
        <div className="w-10 h-10 rounded-full bg-panel-subtle flex items-center justify-center text-text-muted mb-3 border border-border">
          <Activity className="w-5 h-5 text-accent" />
        </div>
        <h4 className="text-sm font-semibold text-text">No Planetary Event Selected</h4>
        <p className="text-xs text-text-muted max-w-[280px] mt-1 leading-relaxed">
          Select any marker pin on the 3D globe or click an item from the live ticker to inspect coordinates, local wind velocity, AQI atmospheric telemetry, and listen to the voice briefing.
        </p>
      </div>
    );
  }

  const topicConfig = TOPIC_REGISTRY[event.topic];

  return (
    <div className="glass-card rounded-panel border border-border p-5 flex flex-col justify-between gap-4">
      <div>
        {/* Header Tags & Severity Meter */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={event.topic as 'calamity' | 'wildlife' | 'sports' | 'news' | 'entertainment'}>
              {topicConfig.label}
            </Badge>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-panel-subtle text-text-muted border border-border uppercase">
              {event.source} / {event.kind}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" title={`Severity ${event.severity} of 5`}>
              <span className="text-[10px] font-mono text-text-muted mr-1">Impact:</span>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <span
                  key={lvl}
                  className={`w-2 h-2 rounded-full ${
                    lvl <= event.severity ? 'bg-topic-calamity' : 'bg-border'
                  }`}
                />
              ))}
            </div>

            <InfoTooltip
              title="Event Severity Scale"
              description="Rated from 1 (minor routine occurrence) to 5 (critical planetary disaster). Calculated from USGS seismic magnitude, EONET fire perimeter, or storm barometric pressure."
              source={`${event.source.toUpperCase()} Feeds`}
              baseline="1: Routine | 3: Notable Regional | 5: Critical"
            />

            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded text-text-muted hover:text-text hover:bg-panel-subtle"
                title="Dismiss selected event"
                aria-label="Dismiss selected event"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-text leading-snug mb-2">
          {event.title}
        </h3>

        {/* Summary Description */}
        <p className="text-xs text-text-secondary leading-relaxed mb-3">
          {event.summary || 'Real-time telemetry event logged by planetary detection sensors.'}
        </p>

        {/* Genuine Atmospheric Telemetry: Wind Speed & Air Quality */}
        {atmospheric ? (
          <div className="mb-3 p-2.5 rounded-lg bg-panel-subtle border border-border/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-accent" />
                <span>Atmospheric Telemetry (Local Sensor Node)</span>
              </span>
              <InfoTooltip
                title="Atmospheric & Air Quality Index (AQI)"
                description="Real-time atmospheric conditions at the event's geographical coordinates pulled via Open-Meteo. Wind speed measures 10m surface velocity. AQI measures particulate density (PM2.5 / PM10) according to EPA standards."
                source="Open-Meteo Weather & AQI API"
                baseline="AQI ≤50: Good | 51-100: Moderate | >150: Unhealthy"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center justify-between p-1.5 rounded bg-panel/60 border border-border/50">
                <span className="text-text-muted text-[10px]">Wind:</span>
                <span className="text-text font-semibold">
                  {atmospheric.windSpeedKmh} km/h {atmospheric.windCompass}
                </span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-panel/60 border border-border/50">
                <span className="text-text-muted text-[10px]">AQI:</span>
                <span className="font-semibold flex items-center gap-1" style={{ color: atmospheric.aqiColor }}>
                  <span>{atmospheric.usAqi}</span>
                  <span className="text-[10px] font-sans">({atmospheric.aqiCategory})</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-panel/60 border border-border/50">
                <span className="text-text-muted text-[10px]">Temp:</span>
                <span className="text-text">
                  {atmospheric.temperatureC}°C ({atmospheric.humidityPct}% hum)
                </span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-panel/60 border border-border/50">
                <span className="text-text-muted text-[10px]">PM2.5:</span>
                <span className="text-text">{atmospheric.pm25} µg/m³</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Location & Time Coordinates */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-text-muted bg-panel-subtle/50 p-2.5 rounded-lg border border-border/60">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span>{event.lat.toFixed(2)}°, {event.lng.toFixed(2)}°</span>
          </div>
          <div className="text-right">
            <span>{formatRelativeTime(event.time)}</span>
          </div>
          <div className="col-span-2 text-[10px] text-text-muted truncate">
            Logged: {formatTimeUTC(event.time)}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
        <Button
          variant="accent"
          size="sm"
          onClick={() => onListen(event)}
          className="flex-1"
        >
          <Volume2 className="w-3.5 h-3.5 mr-1.5" />
          <span>Listen to Nova Brief</span>
        </Button>

        {event.url ? (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 rounded-xl bg-panel-subtle text-text-muted hover:text-text hover:bg-panel border border-border hover:border-border-active transition-colors text-xs"
            title="Open official verified source event page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
};
