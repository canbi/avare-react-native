import { List } from '@/presentation/_domain';

export interface ListStoreState {
  // Data
  lists: List[];

  // Flags
  isRefreshingList: boolean;
  isListLoaded: boolean;

  // Async actions or “thunks”
  fetchLists: () => Promise<void>;
  initializeLists: () => Promise<(() => void) | undefined>;
  createDummyList: () => Promise<void>;
  createDummyLocation: () => Promise<number>;
}
