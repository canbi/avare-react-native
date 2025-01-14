import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import {
  createLocationWithListsAndNotes,
  getLocations,
} from "@/repository/services/locationService";
import {
  createListWithLocations,
  getLists,
} from "@/repository/services/listService";
import { Location, List, Note } from "@/repository/domain";
import * as SQLite from "expo-sqlite";
import { IconSymbol } from "@/components/icon/IconSymbol";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useBottomSheetContext } from "@/contexts/BottomSheetContext";
import LocationItem from "./locationItem";
import ListItem from "./listItem";
import { deleteAndRecreateDatabase } from "@/repository/database/databaseRepository";

const LocationsSheetBody = () => {
  const { bottomSheetRef, profileSheetRef } = useBottomSheetContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLocations = async () => {
    setIsRefreshing(true);
    try {
      const fetchedLocations = await getLocations();
      setLocations(fetchedLocations);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchLists = async () => {
    setIsRefreshing(true);
    try {
      const fetchedLists = await getLists();
      setLists(fetchedLists);
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchLocations();
      await fetchLists();

      const subscription = SQLite.addDatabaseChangeListener(() => {
        fetchLocations();
        fetchLists();
      });

      return () => {
        subscription.remove();
      };
    };

    initialize();
  }, []);

  // DUMMY STUFF
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

  const renderLocationItem = ({ item }: { item: Location }) => (
    <LocationItem key={item.id} location={item} />
  );

  const renderListItem = ({ item }: { item: List }) => (
    <ListItem key={item.id} list={item} />
  );

  return (
    <BottomSheetScrollView style={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Main Sheet</Text>
        <TouchableOpacity
          onPress={() => {
            bottomSheetRef?.current?.snapToIndex(0);
            profileSheetRef?.current?.snapToIndex(1);
          }}
        >
          <IconSymbol size={28} name="person.crop.circle.fill" color="#000" />
        </TouchableOpacity>
      </View>
      <Button title="Create Dummy List" onPress={handleCreateDummyList} />
      <Button
        title="Delete and Recreate Database"
        onPress={handleDeleteAndRecreateDatabase}
      />

      <View style={styles.container}>
        {/* Lists Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Lists</Text>
          <TouchableOpacity onPress={fetchLists} disabled={isRefreshing}>
            <Text style={styles.reloadButton}>
              {isRefreshing ? "Refreshing..." : "Reload"}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={lists}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id!.toString()}
          scrollEnabled={false}
        />

        <View style={{ height: 16 }} />

        {/* Locations Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Locations</Text>
          <TouchableOpacity onPress={fetchLocations} disabled={isRefreshing}>
            <Text style={styles.reloadButton}>
              {isRefreshing ? "Refreshing..." : "Reload"}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.id!.toString()}
          scrollEnabled={false}
        />
      </View>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  reloadButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  locationItem: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default LocationsSheetBody;
