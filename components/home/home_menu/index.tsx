import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MenuView, MenuAction, NativeActionEvent } from '@react-native-menu/menu'; // Import MenuAction
import { MapType } from 'react-native-maps';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AppColors } from '@/constants/AppColors';
import { IconSymbol } from '@/components/icon/IconSymbol';

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
  const menuActions: MenuAction[] = [
    {
      id: 'mapoptions',
      title: 'Map Options',
      displayInline: true,
      subactions: [
        {
          id: 'standard',
          title: 'Standard Map',
          image: Platform.select({
            ios: currentMapType === 'standard' ? 'map.fill' : 'map',
            android: 'ic_menu_map',
          }),
          state: currentMapType === 'standard' ? 'on' : 'off',
        },
        {
          id: 'satellite',
          title: 'Satellite Map',
          image: Platform.select({
            ios: currentMapType === 'satellite' ? 'map.fill' : 'map',
            android: 'ic_menu_camera',
          }),
          state: currentMapType === 'satellite' ? 'on' : 'off',
        },
        {
          id: 'hybrid',
          title: 'Hybrid Map',
          image: Platform.select({
            ios: currentMapType === 'hybrid' ? 'map.fill' : 'map',
            android: 'ic_menu_gallery',
          }),
          state: currentMapType === 'hybrid' ? 'on' : 'off',
        },
      ],
    },
  ];

  if (Platform.OS === 'ios') {
    menuActions.push({
      id: 'poioptions',
      title: 'Point of Interest',
      displayInline: true,
      subactions: [
        {
          id: 'poiopen',
          title: 'Show POIs',
          image: 'mappin.circle.fill',
          state: currentPOI ? 'on' : 'off',
        },
        {
          id: 'poiclose',
          title: 'Hide POIs',
          image: 'mappin.circle',
          state: !currentPOI ? 'on' : 'off',
        },
      ],
    });
  }

  const handleMenuAction = (nativeEvent: NativeActionEvent) => {
    const { event } = nativeEvent.nativeEvent;

    if (event === 'standard') onMapTypeChange('standard');
    else if (event === 'satellite') onMapTypeChange('satellite');
    else if (event === 'hybrid') onMapTypeChange('hybrid');
    else if (event === 'poiopen') setPOI(true);
    else if (event === 'poiclose') setPOI(false);
  };

  return (
    <View style={styles.menu}>
      <MenuView title="" onPressAction={handleMenuAction} actions={menuActions} shouldOpenOnLongPress={false}>
        <TouchableOpacity
          style={[styles.topContainer, { backgroundColor: useThemeColor(AppColors.sheet.background) }]}
          activeOpacity={0.8}
        >
          <IconSymbol size={20} name="map.fill" color={useThemeColor(AppColors.default.text)} />
        </TouchableOpacity>
      </MenuView>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: useThemeColor(AppColors.sheet.divider) }]} />

      {/* Current location button */}
      <TouchableOpacity
        style={[styles.locationContainer, { backgroundColor: useThemeColor(AppColors.sheet.background) }]}
        activeOpacity={0.9}
        onPress={onCenterOnCurrentLocation}
        accessibilityLabel="Center on current location"
        accessibilityRole="button"
      >
        <IconSymbol size={20} name="location" color={useThemeColor(AppColors.default.text)} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeMenu;

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 60,
    right: 16,
  },
  topContainer: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  divider: {
    height: 1,
  },
  locationContainer: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});
