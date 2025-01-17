import { MutableRefObject } from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

export const centerOnCurrentLocation = async (
  mapRef: MutableRefObject<MapView | null>,
  setCurrentLocation: (coords: Location.LocationObjectCoords) => void,
  currentLocation?: Location.LocationObjectCoords
) => {
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
};
