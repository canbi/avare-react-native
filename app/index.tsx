import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import AppBottomSheet from "@/components/sheet/AppBottomSheet";
import { createListWithLocations } from "@/repository/services/listService";
import { createLocationWithListsAndNotes } from "@/repository/services/locationService";
import { List, Location, Note } from "@/repository/domain";
import LocationsSheetBody from "@/views/location-sheet";
import { deleteAndRecreateDatabase } from "@/repository/database/databaseRepository";
import { useBottomSheetContext } from "@/contexts/BottomSheetContext";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

export default function HomeScreen() {
  const { bottomSheetRef, profileSheetRef } = useBottomSheetContext();

  const handleCreateDummyNote = async (): Promise<Omit<Note, "id">> => {
    const note: Omit<Note, "id"> = {
      description: "This is a dummy note",
      date: new Date().toISOString(),
      write_date: new Date().toISOString(),
    };
    return note;
  };

  const handleCreateDummyLocation = async (): Promise<Location> => {
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

    const notes: Omit<Note, "id">[] = [];
    for (let i = 0; i < 3; i++) {
      const note = await handleCreateDummyNote();
      notes.push(note);
    }

    const locationId = await createLocationWithListsAndNotes(
      location,
      [],
      notes
    );
    return { ...location, id: locationId };
  };

  const handleCreateDummyList = async () => {
    try {
      const list: Omit<List, "id"> = {
        title: "Dummy List",
        description: "This is a dummy list",
        emoji: "📝",
        write_date: new Date().toISOString(),
      };

      const locations: number[] = [];
      for (let i = 0; i < 2; i++) {
        const location = await handleCreateDummyLocation();
        locations.push(location.id!);
      }

      await createListWithLocations(list, locations);
      console.log("Dummy list, locations, and notes created successfully!");
    } catch (error) {
      console.error("Error creating dummy list:", error);
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
        title="Delete and Recreate Database"
        onPress={handleDeleteAndRecreateDatabase}
      />

      <AppBottomSheet
        ref={bottomSheetRef}
        showCloseButton={false}
        canDragToClose={false}
      >
        <LocationsSheetBody />
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
