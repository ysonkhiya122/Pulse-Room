import React from 'react';
import { clsx } from 'clsx';

export interface StatTileProps {
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  subtext,
  color,
  className,
}) => {
  return (
    <div
      className={clsx(
        'glass-panel rounded-card p-3 flex flex-col justify-between transition-all hover:border-border-active',
        className
      )}
    >
      <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
        {label}
      </span>
      <div className="my-1 flex items-baseline gap-2">
        <span
          className="text-2xl font-bold font-mono tracking-tight"
          style={{ color: color || '#E6EDF7' }}
        >
          {value}
        </span>
      </div>
      {subtext ? (
        <span className="text-[11px] text-muted truncate">{subtext}</span>
      ) : null}
    </div>
  );
};
