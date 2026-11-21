import { useQuery } from '@tanstack/react-query';
import { fetchAtmosphericTelemetry, AtmosphericData } from './open-meteo';

export function useAtmosphericTelemetry(lat: number, lng: number) {
  return useQuery<AtmosphericData>({
    queryKey: ['atmospheric-telemetry', lat.toFixed(1), lng.toFixed(1)],
    staleTime: 15 * 60 * 1000, // 15 mins per Blueprint Section 7
    queryFn: ({ signal }) => fetchAtmosphericTelemetry(lat, lng, signal),
  });
}
