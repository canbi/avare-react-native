import { create } from 'zustand';
import { LocationStoreState } from './LocationStoreState';
import { Location, Note } from '@/presentation/_domain';
import { createLocationWithListsAndNotes, getLocations } from '@/presentation/_infrastructure/services/LocationService';
import debounce from '@/utils/Debounce';
import * as SQLite from 'expo-sqlite';

export const useLocationStore = create<LocationStoreState>((set, get) => ({
  // State
  locations: [] as Location[],
  isRefreshingLocation: false,
  isLocationLoaded: false,

  // Async actions
  fetchLocations: async () => {
    try {
      set({ isRefreshingLocation: true, locations: [] });
      const fetched = await getLocations();
      if (!fetched.isSuccess) {
        console.error('Failed to fetch locations:', fetched.error);
        return;
      }
      set({ locations: fetched.getValue() });
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      set({ isRefreshingLocation: false });
    }
  },

  initializeLocations: async () => {
    const { isLocationLoaded, fetchLocations } = get();
    if (isLocationLoaded) return;

    // Initial fetch
    await fetchLocations();

    // Subscribe to DB changes for location re-fetch (debounced)
    const subscription = SQLite.addDatabaseChangeListener(() => {
      const debounced = debounce(() => {
        fetchLocations();
      }, 300);
      debounced();
    });

    set({ isLocationLoaded: true });

    return () => {
      subscription.remove();
    };
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
    const notes: Omit<Note, 'id'>[] = Array.from({ length: 3 }).map(() => ({
      description: 'This is a dummy note',
      date: new Date().toISOString(),
      write_date: new Date().toISOString(),
    }));

    const locationId = await createLocationWithListsAndNotes(location, [], notes);
    if (!locationId.isSuccess) throw new Error('Failed to create dummy location');
  },
}));
