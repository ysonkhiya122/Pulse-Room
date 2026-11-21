import React from 'react';
import { Dot } from '@/components/atoms';
import { Wind } from 'lucide-react';

export interface AreaRowProps {
  name: string;
  country: string;
  status: 'nominal' | 'alert' | 'advisory';
  eventCount: number;
  windSpeedKmh?: number;
  windCompass?: string;
  aqi?: number;
  aqiCategory?: string;
  aqiColor?: string;
  onClick?: () => void;
}

export const AreaRow: React.FC<AreaRowProps> = ({
  name,
  country,
  status,
  eventCount,
  windSpeedKmh,
  windCompass,
  aqi,
  aqiCategory,
  aqiColor = '#10B981',
  onClick,
}) => {
  const statusColors = {
    nominal: '#10B981',
    advisory: '#F59E0B',
    alert: '#F43F5E',
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
      className="flex items-center justify-between p-2.5 rounded-lg bg-panel-subtle/50 hover:bg-panel-subtle border border-border/60 hover:border-border-active transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-2.5">
        <Dot color={statusColors[status]} ping={status !== 'nominal'} size="sm" />
        <div>
          <div className="text-xs font-semibold text-text group-hover:text-accent transition-colors flex items-center gap-1.5">
            <span>{name}</span>
            <span className="text-[10px] text-text-muted font-normal">({country})</span>
          </div>

          {(typeof windSpeedKmh === 'number' || typeof aqi === 'number') ? (
            <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted mt-0.5">
              {typeof windSpeedKmh === 'number' ? (
                <span className="flex items-center gap-0.5">
                  <Wind className="w-2.5 h-2.5 text-accent" />
                  <span>{windSpeedKmh} km/h {windCompass}</span>
                </span>
              ) : null}

              {typeof aqi === 'number' ? (
                <span className="flex items-center gap-1">
                  <span>AQI:</span>
                  <span className="font-semibold" style={{ color: aqiColor }}>
                    {aqi} {aqiCategory ? `(${aqiCategory})` : ''}
                  </span>
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="text-right">
        <div
          className="text-[11px] font-mono font-medium"
          style={{ color: statusColors[status] }}
        >
          {statusLabels[status]}
        </div>
        <div className="text-[10px] text-text-muted">
          {eventCount} event{eventCount === 1 ? '' : 's'} in radius
        </div>
      </div>
    </div>
  );
};
