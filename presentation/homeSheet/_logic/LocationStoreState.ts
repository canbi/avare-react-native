import { Location } from '@/presentation/_domain';

export interface LocationStoreState {
  // Data
  locations: Location[];

  // Flags
  isRefreshingLocation: boolean;
  isLocationLoaded: boolean;

  // Async actions or “thunks”
  fetchLocations: () => Promise<void>;
  initializeLocations: () => Promise<(() => void) | undefined>;
  createDummyLocation: () => Promise<void>;
}
