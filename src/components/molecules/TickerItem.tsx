import React from 'react';
import { PulseEvent } from '@/features/events/schema';
import { TOPIC_REGISTRY } from '@/features/news/topics';
import { formatRelativeTime } from '@/lib/time';

export interface TickerItemProps {
  event: PulseEvent;
  onSelect: (event: PulseEvent) => void;
}

export const TickerItem: React.FC<TickerItemProps> = ({ event, onSelect }) => {
  const topicConfig = TOPIC_REGISTRY[event.topic];

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-muted hover:text-text bg-panel/70 hover:bg-panel border border-border/60 hover:border-accent/40 rounded-lg transition-all flex-shrink-0 text-left"
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: topicConfig.color }}
      />
      <span className="font-semibold text-text uppercase text-[10px] tracking-wider" style={{ color: topicConfig.color }}>
        {event.kind}
      </span>
      <span className="max-w-[280px] truncate text-text font-medium">
        {event.title}
      </span>
      <span className="text-[10px] font-mono text-muted/70">
        {formatRelativeTime(event.time)}
      </span>
    </button>
  );
};
