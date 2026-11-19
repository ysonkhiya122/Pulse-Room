import React from 'react';
import { Dot } from '@/components/atoms';

export interface AreaRowProps {
  name: string;
  country: string;
  status: 'nominal' | 'alert' | 'advisory';
  eventCount: number;
  onClick?: () => void;
}

export const AreaRow: React.FC<AreaRowProps> = ({
  name,
  country,
  status,
  eventCount,
  onClick,
}) => {
  const statusColors = {
    nominal: '#7CE38B',
    advisory: '#FFB454',
    alert: '#FF6B6B',
  };

  const statusLabels = {
    nominal: 'Nominal',
    advisory: 'Advisory Active',
    alert: 'Hazard Tracked',
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="flex items-center justify-between p-2.5 rounded-lg bg-panel-subtle/50 hover:bg-panel-subtle border border-border/50 hover:border-border transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-2.5">
        <Dot color={statusColors[status]} ping={status !== 'nominal'} size="sm" />
        <div>
          <div className="text-xs font-semibold text-text group-hover:text-accent transition-colors">
            {name}
          </div>
          <div className="text-[10px] text-muted">{country}</div>
        </div>
      </div>

      <div className="text-right">
        <div
          className="text-[11px] font-mono font-medium"
          style={{ color: statusColors[status] }}
        >
          {statusLabels[status]}
        </div>
        <div className="text-[10px] text-muted">
          {eventCount} event{eventCount === 1 ? '' : 's'} in radius
        </div>
      </div>
    </div>
  );
};
