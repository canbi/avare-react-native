import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import AppBottomSheet from "@/components/sheet/AppBottomSheet";
import LocationsSheetBody from "@/views/location-sheet";
import { useBottomSheetContext } from "@/contexts/BottomSheetContext";
import ProfileSheetBody from "@/views/profile-sheet";
import MapView, { MapType, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MenuView } from "@react-native-menu/menu";

export default function HomeScreen() {
  const { bottomSheetRef, profileSheetRef } = useBottomSheetContext();
  const [mapType, setMapType] = useState<MapType>("standard");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      await Location.requestForegroundPermissionsAsync();
    };

    requestLocationPermission();
  }, []);

  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const markers = [
    {
      id: 1,
      coordinate: { latitude: 37.78825, longitude: -122.4324 },
      title: "Marker 1",
      description: "This is marker 1",
      //icon: "place",
    },
    {
      id: 2,
      coordinate: { latitude: 37.78925, longitude: -122.4334 },
      title: "Marker 2",
      description: "This is marker 2",
      //icon: "location-on",
    },
  ];

  const handleMapTypeChange = (type: MapType) => {
    setMapType(type);
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        mapType={mapType}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          ></Marker>
        ))}
      </MapView>

      {/* <View style={styles.mapMenuButtonContainer}>
        <BlurView style={styles.materialBackground} intensity={60}>
          <TouchableOpacity
            style={styles.mapMenuButtonTop}
            onPress={() => setShowMenu(!showMenu)}
          >
            <MaterialIcons name="map" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.mapMenuButtonBottom}
            onPress={() => setShowMenu(!showMenu)}
          >
            <MaterialIcons name="map" size={24} color="white" />
          </TouchableOpacity>
        </BlurView>
      </View> */}

      <MenuView
        style={styles.menu}
        title="Menu Title"
        onPressAction={({ nativeEvent }) => {
          console.warn(JSON.stringify(nativeEvent));
        }}
        actions={[
          {
            id: "share",
            title: "Share Action",
            titleColor: "#46F289",
            subtitle: "Share action on SNS",
            image: Platform.select({
              ios: "square.and.arrow.up",
              android: "ic_menu_share",
            }),
            imageColor: "#46F289",
            state: "on",
          },
        ]}
        shouldOpenOnLongPress={false}
      >
        <View>
          <Text>Menu Contentasdasdasdasdasda</Text>
        </View>
      </MenuView>

      {/* {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMapTypeChange("standard")}
          >
            <Text style={styles.menuText}>Standard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMapTypeChange("satellite")}
          >
            <Text style={styles.menuText}>Satellite</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMapTypeChange("hybrid")}
          >
            <Text style={styles.menuText}>Hybrid</Text>
          </TouchableOpacity>
        </View>
      )} */}

      <AppBottomSheet
        ref={bottomSheetRef}
        showCloseButton={false}
        canDragToClose={false}
      >
        <LocationsSheetBody />
      </AppBottomSheet>

      <AppBottomSheet
        ref={profileSheetRef}
        initialPosition={-1}
        snapPoints={["50%", "90%"]}
      >
        <ProfileSheetBody />
      </AppBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapMenuButtonContainer: {
    position: "absolute",
    top: 40,
    right: 10,
    alignItems: "center",
  },
  materialBackground: {
    width: 60,
    height: 120,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 5,
  },
  mapMenuButtonTop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapMenuButtonBottom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  menu: {
    position: "absolute",
    top: 180,
    right: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    padding: 10,
  },
  menuText: {
    color: "white",
    fontSize: 16,
  },
});
