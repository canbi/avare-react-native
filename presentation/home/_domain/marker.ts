import { LatLng } from 'react-native-maps';

export interface MarkerInterface {
  id: number;
  coordinate: LatLng;
  title: string;
  description: string;
}
