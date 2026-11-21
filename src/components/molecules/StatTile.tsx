import React from 'react';
import { clsx } from 'clsx';
import { InfoTooltip } from '@/components/atoms/InfoTooltip';

export interface StatTileProps {
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  className?: string;
  info?: {
    title: string;
    description: string;
    source?: string;
    baseline?: string;
  };
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  subtext,
  color,
  className,
  info,
}) => {
  return (
    <div
      className={clsx(
        'glass-card rounded-card p-3.5 flex flex-col justify-between transition-all duration-200 hover:border-border-active relative',
        className
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          {label}
        </span>
        {info ? (
          <InfoTooltip
            title={info.title}
            description={info.description}
            source={info.source}
            baseline={info.baseline}
          />
        ) : null}
      </div>

      <div className="my-1.5 flex items-baseline gap-2">
        <span
          className="text-2xl font-bold font-mono tracking-tight"
          style={{ color: color || '#F1F5F9' }}
        >
          {value}
        </span>
      </div>

      {subtext ? (
        <span className="text-[11px] text-text-muted truncate">{subtext}</span>
      ) : null}
    </div>
  );
};
