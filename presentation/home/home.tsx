import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps';
import MainSheetBody from '@/presentation/homeSheet';
import ProfileSheetBody from '@/presentation/profileSheet';
import { useBottomSheetContext } from '@/presentation/_logic/BottomSheetContext';
import { useMapStore } from './_logic/MapStore';
import { centerOnCurrentLocation } from './_logic/MapLogic';
import { LocationObjectCoords } from 'expo-location';
import HomeMenu from './subviews/homeMenu';
import AppBottomSheet from '../components/sheet/AppBottomSheet';

export default function Home() {
  // If you still want separate sheet handling from a context:
  const { bottomSheetRef, profileSheetRef } = useBottomSheetContext();

  // Local ref to the MapView
  const mapRef = useRef<MapView>(null);

  // Consume store state & actions
  const {
    mapType,
    showPOI,
    currentLocation,
    markers,
    initialRegion,
    setMapType,
    setShowPOI,
    setCurrentLocation,
    addMarker,
  } = useMapStore();

  // Callback for when user long-presses to add a marker
  const handleLongPress = (event: { nativeEvent: { coordinate: LatLng } }) => {
    bottomSheetRef?.current?.snapToIndex(0);
    addMarker(event.nativeEvent.coordinate);
    // TODO: open create sheet modal or any additional flow
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        mapType={mapType}
        showsPointsOfInterest={showPOI}
        onLongPress={handleLongPress}
        onUserLocationChange={(event) => {
          const { coordinate } = event.nativeEvent;
          if (coordinate) setCurrentLocation(event.nativeEvent.coordinate as LocationObjectCoords);
        }}
      >
        {markers.map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate} pinColor="purple" />
        ))}
      </MapView>

      <HomeMenu
        currentMapType={mapType}
        onMapTypeChange={setMapType}
        onCenterOnCurrentLocation={() => {
          centerOnCurrentLocation(mapRef);
          bottomSheetRef?.current?.snapToIndex(0);
        }}
        setPOI={setShowPOI}
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
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
