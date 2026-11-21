import React from 'react';
import { PulseEvent } from '@/features/events/schema';
import { TickerItem } from '@/components/molecules/TickerItem';
import { Radio } from 'lucide-react';

export interface TickerProps {
  events: PulseEvent[];
  onSelectEvent: (event: PulseEvent) => void;
}

export const Ticker: React.FC<TickerProps> = ({ events, onSelectEvent }) => {
  return (
    <div className="w-full glass-card border-y border-border py-1.5 px-3 flex items-center gap-3 overflow-hidden select-none">
      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-accent uppercase tracking-wider flex-shrink-0 pr-2 border-r border-border">
        <Radio className="w-3 h-3 animate-pulse text-accent" />
        <span>Live Feed</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
        {events.slice(0, 10).map((event) => (
          <TickerItem key={event.id} event={event} onSelect={onSelectEvent} />
        ))}
      </div>
    </div>
  );
};
