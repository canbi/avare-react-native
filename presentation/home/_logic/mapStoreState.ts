import { LatLng, MapType, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MarkerInterface } from '../_domain/Marker';

export interface MapStoreState {
  mapType: MapType;
  showPOI: boolean;
  currentLocation?: Location.LocationObjectCoords;
  markers: MarkerInterface[];
  initialRegion: Region;

  setMapType: (type: MapType) => void;
  setShowPOI: (show: boolean) => void;
  setCurrentLocation: (coords: Location.LocationObjectCoords) => void;
  addMarker: (coordinate: LatLng) => void;
}
