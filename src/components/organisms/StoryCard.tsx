import React from 'react';
import { PulseEvent } from '@/features/events/schema';
import { TOPIC_REGISTRY } from '@/features/news/topics';
import { Badge, Button } from '@/components/atoms';
import { formatTimeUTC, formatRelativeTime } from '@/lib/time';
import { Volume2, ExternalLink, MapPin, Info, X } from 'lucide-react';

export interface StoryCardProps {
  event: PulseEvent | null;
  onListen: (event: PulseEvent) => void;
  onClose?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ event, onListen, onClose }) => {
  if (!event) {
    return (
      <div className="glass-panel rounded-panel border border-border/80 p-5 flex flex-col items-center justify-center text-center min-h-[220px]">
        <div className="w-10 h-10 rounded-full bg-panel-subtle flex items-center justify-center text-muted mb-3 border border-border">
          <Info className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-text">No Event Selected</h4>
        <p className="text-xs text-muted max-w-[280px] mt-1 leading-relaxed">
          Select any marker pin on the 3D globe or click an item from the live ticker to inspect details and listen to the briefing.
        </p>
      </div>
    );
  }

  const topicConfig = TOPIC_REGISTRY[event.topic];

  return (
    <div className="glass-panel rounded-panel border border-border/80 p-5 flex flex-col justify-between gap-4">
      <div>
        {/* Header Tags & Severity Meter */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={event.topic as 'calamity' | 'wildlife' | 'sports' | 'news' | 'entertainment'}>
              {topicConfig.label}
            </Badge>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-panel-subtle text-muted border border-border uppercase">
              {event.source} / {event.kind}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" title={`Severity ${event.severity} of 5`}>
              <span className="text-[10px] font-mono text-muted mr-1">Impact:</span>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <span
                  key={lvl}
                  className={`w-2 h-2 rounded-full ${
                    lvl <= event.severity ? 'bg-topic-calamity' : 'bg-border'
                  }`}
                />
              ))}
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded text-muted hover:text-text hover:bg-panel-subtle"
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
        <p className="text-xs text-muted leading-relaxed mb-3">
          {event.summary || 'Real-time telemetry event logged by planetary detection sensors.'}
        </p>

        {/* Location & Time Coordinates */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-muted bg-panel-subtle/70 p-2.5 rounded-lg border border-border/60">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span>{event.lat.toFixed(2)}°, {event.lng.toFixed(2)}°</span>
          </div>
          <div className="text-right">
            <span>{formatRelativeTime(event.time)}</span>
          </div>
          <div className="col-span-2 text-[10px] text-muted/70 truncate">
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
            className="inline-flex items-center justify-center p-2 rounded-xl bg-panel-subtle text-muted hover:text-text hover:bg-panel border border-border hover:border-border-active transition-colors text-xs"
            title="Open official source event page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
};
