import { Location } from '@/presentation/_domain';

export interface ListItemStoreState {
  locations: Location[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLocationsForList: (listId: number) => Promise<void>;
}
