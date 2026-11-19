import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

export interface BriefCardProps {
  headline?: string;
  summary?: string;
  sourceAttribution?: string;
  timestamp?: string;
}

export const BriefCard: React.FC<BriefCardProps> = ({
  headline = 'Global Grid Interconnection Summit Ratifies Cross-Border Clean Energy Corridors',
  summary = 'Ministers and grid dispatch operators across 18 nations sign multilateral reserve agreements to stabilize renewable seasonal surpluses.',
  sourceAttribution = 'Data: World Monitor',
  timestamp = 'Updated 35m ago',
}) => {
  return (
    <div className="glass-panel rounded-panel border border-border/80 p-4 flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>World Brief</span>
          </div>
          <span className="text-[10px] font-mono text-muted">{timestamp}</span>
        </div>

        <h4 className="text-xs font-bold text-text leading-snug mb-1.5">
          {headline}
        </h4>

        <p className="text-[11px] text-muted leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted/80 pt-2 border-t border-border/50 font-mono">
        <span>{sourceAttribution}</span>
        <span className="text-accent hover:underline cursor-pointer flex items-center gap-1">
          <span>Read analysis</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
};
