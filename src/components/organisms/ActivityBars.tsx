import React from 'react';
import { PulseEvent } from '@/features/events/schema';
import { BarChart3 } from 'lucide-react';
import { InfoTooltip } from '@/components/atoms/InfoTooltip';

export interface ActivityBarsProps {
  events: PulseEvent[];
}

export const ActivityBars: React.FC<ActivityBarsProps> = ({ events }) => {
  // Compute events count in 24 1-hour bins
  const hourlyBins = Array.from({ length: 24 }, (_, idx) => {
    const hoursAgo = 23 - idx;
    const count = events.filter((e) => {
      const diffHours = (Date.now() - new Date(e.time).getTime()) / (1000 * 60 * 60);
      return diffHours >= hoursAgo && diffHours < hoursAgo + 1;
    }).length;
    return { hour: `${hoursAgo}h`, count };
  });

  const maxCount = Math.max(1, ...hourlyBins.map((b) => b.count));

  return (
    <div className="glass-card rounded-panel border border-border p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-text">
          <BarChart3 className="w-3.5 h-3.5 text-accent" />
          <span>24h Planetary Activity Distribution</span>
          <InfoTooltip
            title="Hourly Event Histogram"
            description="Visualizes the temporal frequency of global events grouped into 24 one-hour time bins. Useful for observing seismic aftershock sequences or storm development over time."
            source="Pulse Room Client Selector"
            baseline="24 Consecutive 1-Hour Buckets"
          />
        </div>
        <span className="text-[10px] font-mono text-text-muted">Total: {events.length}</span>
      </div>

      <div className="flex items-end gap-1 h-14 pt-2 px-1">
        {hourlyBins.map((bin, i) => {
          const heightPct = Math.max(12, (bin.count / maxCount) * 100);
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full group relative"
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-200 ${
                  bin.count > 0 ? 'bg-accent/80 hover:bg-accent' : 'bg-border/60'
                }`}
                style={{ height: `${heightPct}%` }}
              />
              {/* Tooltip on hover */}
              <div className="absolute -top-7 hidden group-hover:flex items-center justify-center text-[9px] font-mono bg-panel border border-border px-1.5 py-0.5 rounded text-text whitespace-nowrap z-20 shadow-card">
                {bin.count} at -{bin.hour}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-text-muted font-mono">
        <span>-24h</span>
        <span>-18h</span>
        <span>-12h</span>
        <span>-6h</span>
        <span>Now</span>
      </div>
    </div>
  );
};
