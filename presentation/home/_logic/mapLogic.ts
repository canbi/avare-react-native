import * as Location from 'expo-location';
import { MutableRefObject } from 'react';
import MapView from 'react-native-maps';
import { useMapStore } from './MapStore';

export async function centerOnCurrentLocation(mapRef: MutableRefObject<MapView | null>) {
  const { currentLocation, setCurrentLocation } = useMapStore.getState();

  let location = currentLocation;
  if (!location) {
    const position = await Location.getCurrentPositionAsync({});
    location = position.coords;
    setCurrentLocation(location);
  }

  if (mapRef.current && location) {
    mapRef.current.animateToRegion(
      {
        latitude: location.latitude - 0.005,
        longitude: location.longitude,
        latitudeDelta: 0.032,
        longitudeDelta: 0.032,
      },
      500
    );
  }
}
