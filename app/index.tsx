import React, { useRef } from "react";
import { View, StyleSheet, Text, Button, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { IconSymbol } from "@/components/icon/IconSymbol";
import AppBottomSheet from "@/components/sheet/AppBottomSheet";
import { createListWithLocations } from "@/repository/services/listService";
import { createLocationWithListsAndNotes } from "@/repository/services/locationService";
import { List, Location, Note } from "@/repository/domain";
import LocationsSheetBody from "@/views/location-sheet";
import { deleteAndRecreateDatabase } from "@/repository/databaseRepository"; // Import the new function

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const profileSheetRef = useRef<BottomSheet>(null);

  const handleCreateDummyList = async () => {
    try {
      const list: Omit<List, "id"> = {
        title: "Dummy List",
        description: "This is a dummy list",
        emoji: "📝",
        write_date: new Date().toISOString(),
      };
      await createListWithLocations(list, []);
    } catch (error) {
      console.error("Error creating dummy list:", error);
    }
  };

  const handleCreateDummyLocation = async () => {
    try {
      const location: Omit<Location, "id"> = {
        latitude: 37.7749,
        longitude: -122.4194,
        title: "Dummy Location",
        description: "This is a dummy location",
        emoji: "📍",
        color: "#FF0000",
        is_cover_empty: false,
        country: "USA",
        country_code: "US",
        local_address: "San Francisco, CA",
        write_date: new Date().toISOString(),
        photo_ids: "",
      };

      const note = await handleCreateDummyNote();

      await createLocationWithListsAndNotes(location, [], [note]);
    } catch (error) {
      console.error("Error creating dummy location:", error);
    }
  };

  const handleCreateDummyNote = async () => {
    try {
      const note: Omit<Note, "id"> = {
        description: "This is a dummy note",
        date: new Date().toISOString(),
        write_date: new Date().toISOString(),
        location_id: 1,
      };
      return note;
    } catch (error) {
      console.error("Error creating dummy note:", error);
      throw error;
    }
  };

  const handleDeleteAndRecreateDatabase = async () => {
    try {
      await deleteAndRecreateDatabase();
      console.log("Database deleted and recreated successfully");
    } catch (error) {
      console.error("Error deleting and recreating database:", error);
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Text>Home Screen</Text>

      <Button title="Create Dummy List" onPress={handleCreateDummyList} />
      <Button
        title="Create Dummy Location"
        onPress={handleCreateDummyLocation}
      />
      <Button
        title="Delete and Recreate Database"
        onPress={handleDeleteAndRecreateDatabase}
      />

      <AppBottomSheet
        ref={bottomSheetRef}
        showCloseButton={false}
        canDragToClose={false}
      >
        <BottomSheetScrollView style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Main Sheet</Text>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.snapToIndex(0);
                profileSheetRef.current?.snapToIndex(1);
              }}
            >
              <IconSymbol
                size={28}
                name="person.crop.circle.fill"
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <LocationsSheetBody />
        </BottomSheetScrollView>
      </AppBottomSheet>

      <AppBottomSheet ref={profileSheetRef} initialPosition={-1}>
        <BottomSheetScrollView style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile Sheet</Text>
          </View>
          <Text>Awesome 🎉</Text>
        </BottomSheetScrollView>
      </AppBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});
