import { EventAdapter } from '../schema';
import { UsgsAdapter } from './usgs';
import { EonetAdapter } from './eonet';
import { GbifAdapter } from './gbif';
import { ScientificNewsAdapter } from './scientificNews';
import { SnapshotAdapter } from './snapshot';

export const defaultAdapters: EventAdapter[] = [
  new UsgsAdapter(),
  new EonetAdapter(),
  new GbifAdapter(),
  new ScientificNewsAdapter(),
];

export const fallbackAdapter = new SnapshotAdapter();

export * from './usgs';
export * from './eonet';
export * from './gbif';
export * from './scientificNews';
export * from './snapshot';
