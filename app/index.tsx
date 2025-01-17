import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import AppBottomSheet from '@/components/sheet/AppBottomSheet';
import MainSheetBody from '@/views/main-sheet';
import { useBottomSheetContext } from '@/contexts/BottomSheetContext';
import ProfileSheetBody from '@/views/profile-sheet';
import MapView, { MapType, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import HomeMenu from '@/components/home/home_menu';
import { centerOnCurrentLocation } from '@/utils/mapUtils';

export default function HomeScreen() {
  const { bottomSheetRef, profileSheetRef } = useBottomSheetContext();
  const [mapType, setMapType] = useState<MapType>('standard');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords>();
  const [showPOI, setShowPOI] = useState(true);
  const mapRef = useRef<MapView>(null);

  // TODO get from local
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // TODO get from local
  const markers = [
    {
      id: 1,
      coordinate: { latitude: 37.78825, longitude: -122.4324 },
      title: 'Marker 1',
      description: 'This is marker 1',
    },
    {
      id: 2,
      coordinate: { latitude: 37.78925, longitude: -122.4334 },
      title: 'Marker 2',
      description: 'This is marker 2',
    },
  ];

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        onUserLocationChange={(event) => {
          const { coordinate } = event.nativeEvent;
          if (coordinate) setCurrentLocation(event.nativeEvent.coordinate as Location.LocationObjectCoords);
        }}
        mapType={mapType}
        showsPointsOfInterest={showPOI}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>

      <HomeMenu
        currentMapType={mapType}
        onMapTypeChange={(type) => setMapType(type)}
        onCenterOnCurrentLocation={() => {
          centerOnCurrentLocation(mapRef, setCurrentLocation, currentLocation);
          bottomSheetRef?.current?.snapToIndex(0);
        }}
        setPOI={(show) => setShowPOI(show)}
        currentPOI={showPOI}
      />

      <AppBottomSheet ref={bottomSheetRef} showCloseButton={false} canDragToClose={false}>
        <MainSheetBody />
      </AppBottomSheet>

      <AppBottomSheet ref={profileSheetRef} initialPosition={-1} snapPoints={['50%', '90%']}>
        <ProfileSheetBody />
      </AppBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
