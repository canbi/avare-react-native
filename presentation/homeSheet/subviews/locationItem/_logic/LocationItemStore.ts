// createLocationItemStore.ts
import { createStore } from 'zustand';
import { getNotesForLocation } from '@/presentation/_infrastructure/services/NoteService';
import { LocationItemStoreState } from './LocationItemStoreState';

export function createLocationItemStore() {
  return createStore<LocationItemStoreState>((set) => ({
    notes: [],
    isLoading: false,
    error: null,

    fetchNotesForLocation: async (locationId: number) => {
      try {
        set({ isLoading: true, error: null, notes: [] });

        const fetched = await getNotesForLocation(locationId);
        if (!fetched.isSuccess) {
          set({ isLoading: false, error: 'Failed to fetch notes.' });
          return;
        }

        set({ notes: fetched.getValue() });
      } catch (err) {
        console.error('Error fetching notes for location:', err);
        set({ error: 'An error occurred while fetching notes.' });
      } finally {
        set({ isLoading: false });
      }
    },
  }));
}
