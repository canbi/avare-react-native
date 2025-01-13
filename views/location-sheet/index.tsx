import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { getLocations } from "@/repository/services/locationService";
import { getLists } from "@/repository/services/listService";
import { Location, List } from "@/repository/domain";
import * as SQLite from "expo-sqlite";
import { IconSymbol } from "@/components/icon/IconSymbol";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useBottomSheetContext } from "@/contexts/BottomSheetContext";
import LocationItem from "./locationItem";
import ListItem from "./listItem";

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
