import { create } from 'zustand';
import { MapStoreState } from './MapStoreState';

export const useMapStore = create<MapStoreState>((set) => ({
  // --- State ---
  mapType: 'standard',
  showPOI: true,
  currentLocation: undefined,
  markers: [],
  initialRegion: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },

  // --- Actions/Reducers ---
  setMapType: (mapType) => set(() => ({ mapType })),
  setShowPOI: (showPOI) => set(() => ({ showPOI })),
  setCurrentLocation: (coords) => set(() => ({ currentLocation: coords })),
  addMarker: (coordinate) =>
    set((state) => {
      const nextId = state.markers.length + 1;
      return {
        markers: [
          ...state.markers,
          {
            id: nextId,
            coordinate,
            title: `Marker ${nextId}`,
            description: `Description for Marker ${nextId}`,
          },
        ],
      };
    }),
}));
