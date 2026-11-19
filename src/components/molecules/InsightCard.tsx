import React from 'react';
import { PulseInsight } from '@/features/insights/rules';
import { clsx } from 'clsx';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export interface InsightCardProps {
  insight: PulseInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const urgencyStyles = {
    low: 'border-border/60 hover:border-border-active',
    medium: 'border-topic-storm/40 hover:border-topic-storm/70',
    high: 'border-topic-calamity/50 hover:border-topic-calamity/80',
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

  return (
    <div
      className={clsx(
        'glass-panel rounded-card p-3.5 flex flex-col justify-between transition-all duration-200 border',
        urgencyStyles[insight.urgency]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h4 className="text-xs font-semibold text-text">{insight.title}</h4>
        </div>
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-panel-subtle text-accent border border-border">
          {insight.metric}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
        {insight.description}
      </p>
    </div>
  );
};
