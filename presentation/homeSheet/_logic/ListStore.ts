import { create } from 'zustand';
import { ListStoreState } from './ListStoreState';
import { createListWithLocations, getLists } from '@/presentation/_infrastructure/services/ListService';
import * as SQLite from 'expo-sqlite';
import debounce from '@/utils/Debounce';
import { List, Location, Note } from '@/presentation/_domain';
import { createLocationWithListsAndNotes } from '@/presentation/_infrastructure/services/LocationService';

export const useListStore = create<ListStoreState>((set, get) => ({
  // State
  lists: [],
  isRefreshingList: false,
  isListLoaded: false,

  fetchLists: async () => {
    try {
      set({ isRefreshingList: true, lists: [] });
      const fetched = await getLists();
      if (!fetched.isSuccess) {
        console.error('Failed to fetch lists:', fetched.error);
        return;
      }
      set({ lists: fetched.getValue() });
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      set({ isRefreshingList: false });
    }
  },

  initializeLists: async () => {
    const { isListLoaded, fetchLists } = get();
    if (isListLoaded) return;

    // Initial fetch
    await fetchLists();

    // Subscribe to DB changes for lists re-fetch (debounced)
    const subscription = SQLite.addDatabaseChangeListener(() => {
      const debounced = debounce(() => {
        fetchLists();
      }, 300);
      debounced();
    });

    set({ isListLoaded: true });

    return () => {
      subscription.remove();
    };
  },

  createDummyList: async () => {
    try {
      const list: Omit<List, 'id'> = {
        title: 'Dummy List',
        description: 'This is a dummy list',
        emoji: '📝',
        write_date: new Date().toISOString(),
      };

      const locationIds = [];
      for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
        const locationId = await get().createDummyLocation();
        locationIds.push(locationId);
      }

      // Then create list
      const listId = await createListWithLocations(list, locationIds);
      if (!listId.isSuccess) throw new Error('Failed to create dummy list');
    } catch (error) {
      console.error('Error creating dummy list:', error);
    }
  },
  createDummyLocation: async () => {
    const location: Omit<Location, 'id'> = {
      latitude: 37.7749,
      longitude: -122.4194,
      title: 'Dummy Location',
      description: 'This is a dummy location',
      emoji: '📍',
      color: '#FF0000',
      is_cover_empty: false,
      country: 'USA',
      country_code: 'US',
      local_address: 'San Francisco, CA',
      write_date: new Date().toISOString(),
      photo_ids: '',
    };

    // Example: create some notes
    const notes: Omit<Note, 'id'>[] = Array.from({ length: 2 }).map(() => ({
      description: 'This is a dummy note',
      date: new Date().toISOString(),
      write_date: new Date().toISOString(),
    }));

    const locationId = await createLocationWithListsAndNotes(location, [], notes);
    if (!locationId.isSuccess) throw new Error('Failed to create dummy location');

    return locationId.getValue();
  },
}));
