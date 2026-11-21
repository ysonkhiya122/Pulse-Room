import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { InfoTooltip } from '@/components/atoms/InfoTooltip';

export interface BriefCardProps {
  headline?: string;
  summary?: string;
  sourceAttribution?: string;
  timestamp?: string;
}

export const BriefCard: React.FC<BriefCardProps> = ({
  headline = 'Global Grid Interconnection Summit Ratifies Cross-Border Clean Energy Corridors',
  summary = 'Ministers and grid dispatch operators across 18 nations sign multilateral reserve agreements to stabilize renewable seasonal surpluses.',
  sourceAttribution = 'Data: World Monitor Public Route',
  timestamp = 'Updated 35m ago',
}) => {
  return (
    <div className="glass-card rounded-panel border border-border p-4 flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>World Brief</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-text-muted">{timestamp}</span>
            <InfoTooltip
              title="World Brief Intelligence Synthesis"
              description="Curated high-level planetary news and cross-border developments. In the free tier build, only non-key-gated public endpoints are queried with aggressive caching."
              source="World Monitor Intelligence (AGPL Attribution)"
              baseline="Refreshed every 10–15 minutes"
            />
          </div>
        </div>

        <h4 className="text-xs font-bold text-text leading-snug mb-1.5">
          {headline}
        </h4>

        <p className="text-[11px] text-text-secondary leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-border/60 font-mono">
        <span>{sourceAttribution}</span>
        <a
          href="https://worldmonitor.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline flex items-center gap-1"
        >
          <span>Read analysis</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
};
