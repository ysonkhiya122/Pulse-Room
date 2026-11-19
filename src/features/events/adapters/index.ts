import { EventAdapter } from '../schema';
import { UsgsAdapter } from './usgs';
import { EonetAdapter } from './eonet';
import { SnapshotAdapter } from './snapshot';

export const defaultAdapters: EventAdapter[] = [
  new UsgsAdapter(),
  new EonetAdapter(),
];

export const fallbackAdapter = new SnapshotAdapter();
