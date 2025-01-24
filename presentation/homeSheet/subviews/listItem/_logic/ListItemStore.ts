import { createStore } from 'zustand';
import { getLocationsForList } from '@/presentation/_infrastructure/services/ListService';
import { ListItemStoreState } from './ListItemStoreState';

export function createListItemStore() {
  return createStore<ListItemStoreState>((set) => ({
    locations: [],
    isLoading: false,
    error: null,

    fetchLocationsForList: async (listId: number) => {
      try {
        set({ isLoading: true, error: null, locations: [] });
        const fetched = await getLocationsForList(listId);
        if (!fetched.isSuccess) {
          set({ isLoading: false, error: 'Failed to fetch locations.' });
          return;
        }
        set({ locations: fetched.getValue() });
      } catch (err) {
        console.error('Error fetching list item locations:', err);
        set({ isLoading: false, error: 'An error occurred while fetching.' });
      } finally {
        set({ isLoading: false });
      }
    },
  }));
}
