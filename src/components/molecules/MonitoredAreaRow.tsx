import React from 'react';
import { AreaRow } from './AreaRow';
import { useAtmosphericTelemetry } from '@/features/weather';

export interface MonitoredAreaRowProps {
  name: string;
  country: string;
  lat: number;
  lng: number;
  status: 'nominal' | 'alert' | 'advisory';
  eventCount: number;
  onClick?: () => void;
}

export const MonitoredAreaRow: React.FC<MonitoredAreaRowProps> = ({
  name,
  country,
  lat,
  lng,
  status,
  eventCount,
  onClick,
}) => {
  const { data: telemetry } = useAtmosphericTelemetry(lat, lng);

  return (
    <AreaRow
      name={name}
      country={country}
      status={status}
      eventCount={eventCount}
      windSpeedKmh={telemetry?.windSpeedKmh}
      windCompass={telemetry?.windCompass}
      aqi={telemetry?.usAqi}
      aqiCategory={telemetry?.aqiCategory}
      aqiColor={telemetry?.aqiColor}
      onClick={onClick}
    />
  );
};
