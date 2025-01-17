import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MenuView } from '@react-native-menu/menu';
import { BlurView } from 'expo-blur';
import { MapType } from 'react-native-maps';

interface HomeMenuProps {
  currentMapType: MapType;
  onMapTypeChange: (type: MapType) => void;
  onCenterOnCurrentLocation: () => void;
  currentPOI: boolean;
  setPOI: (showPOI: boolean) => void;
}

const HomeMenu: React.FC<HomeMenuProps> = ({
  currentMapType,
  onMapTypeChange,
  onCenterOnCurrentLocation,
  currentPOI,
  setPOI,
}) => {
  return (
    <MenuView
      style={styles.menu}
      title=""
      onPressAction={({ nativeEvent }) => {
        console.log(nativeEvent);
        const { event } = nativeEvent;

        if (event === 'standard') {
          onMapTypeChange('standard');
        } else if (event === 'satellite') {
          onMapTypeChange('satellite');
        } else if (event === 'hybrid') {
          onMapTypeChange('hybrid');
        } else if (event === 'center') {
          onCenterOnCurrentLocation();
        } else if (event === 'poiopen') {
          setPOI(true);
        } else if (event === 'poiclose') {
          setPOI(false);
        }
      }}
      actions={[
        {
          id: 'mapoptions',
          title: 'Map Options',
          displayInline: true,
          subactions: [
            {
              id: 'standard',
              title: 'Standard Map',
              image: Platform.select({
                ios: 'map',
                android: 'ic_menu_map',
              }),
              state: currentMapType === 'standard' ? 'on' : 'off',
            },
            {
              id: 'satellite',
              title: 'Satellite Map',
              image: Platform.select({
                ios: 'globe',
                android: 'ic_menu_camera',
              }),
              state: currentMapType === 'satellite' ? 'on' : 'off',
            },
            {
              id: 'hybrid',
              title: 'Hybrid Map',
              image: Platform.select({
                ios: 'layers',
                android: 'ic_menu_gallery',
              }),
              state: currentMapType === 'hybrid' ? 'on' : 'off',
            },
          ],
        },
        {
          id: 'poioptions',
          title: 'Point of Interest',
          displayInline: true,
          subactions: [
            {
              id: 'poiopen',
              title: 'Show POIs',
              image: Platform.select({
                ios: 'eye',
                android: 'ic_menu_view',
              }),
              state: currentPOI ? 'on' : 'off',
            },
            {
              id: 'poiclose',
              title: 'Hide POIs',
              image: Platform.select({
                ios: 'eye.slash',
                android: 'ic_menu_close',
              }),
              state: !currentPOI ? 'on' : 'off',
            },
          ],
        },
        {
          id: 'center',
          title: 'Center on My Location',
          image: Platform.select({
            ios: 'location.circle',
            android: 'ic_menu_mylocation',
          }),
          displayInline: true,
        },
      ]}
      shouldOpenOnLongPress={false}
    >
      <BlurView intensity={50} tint="light" style={styles.blurBackground}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Menu</Text>
        </View>
      </BlurView>
    </MenuView>
  );
};

export default HomeMenu;

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 60,
    right: 16,
  },
  blurBackground: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  buttonContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
