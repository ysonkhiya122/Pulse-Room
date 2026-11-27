import { EventAdapter } from '../schema';
import { UsgsAdapter } from './usgs';
import { EonetAdapter } from './eonet';
import { GdacsAdapter } from './gdacs';
import { GbifAdapter } from './gbif';
import { SpaceflightNewsAdapter } from './spaceflightNews';
import { NoaaSpaceWeatherAdapter } from './noaaSpaceWeather';
import { ScientificNewsAdapter } from './scientificNews';
import { SnapshotAdapter } from './snapshot';

export const defaultAdapters: EventAdapter[] = [
  new UsgsAdapter(),
  new EonetAdapter(),
  new GdacsAdapter(),
  new GbifAdapter(),
  new SpaceflightNewsAdapter(),
  new NoaaSpaceWeatherAdapter(),
  new ScientificNewsAdapter(),
];

export const fallbackAdapter = new SnapshotAdapter();

export * from './usgs';
export * from './eonet';
export * from './gdacs';
export * from './gbif';
export * from './spaceflightNews';
export * from './noaaSpaceWeather';
export * from './scientificNews';
export * from './snapshot';
