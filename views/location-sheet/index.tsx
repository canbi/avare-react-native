import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getLocations } from "@/repository/services/locationService";
import { Location } from "@/repository/domain";
import * as SQLite from "expo-sqlite";
import { IconSymbol } from "@/components/icon/IconSymbol";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useBottomSheetContext } from "@/contexts/BottomSheetContext";

const LocationsSheetBody = () => {
  const { bottomSheetRef, profileSheetRef } = useBottomSheetContext();
  const [locations, setLocations] = useState<Location[]>([]);
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

  useEffect(() => {
    const initialize = async () => {
      await fetchLocations();

      const subscription = SQLite.addDatabaseChangeListener(() => {
        fetchLocations();
      });

      return () => {
        subscription.remove();
      };
    };

    initialize();
  }, []);

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
        <View style={styles.header}>
          <Text style={styles.title}>Locations</Text>
          <TouchableOpacity onPress={fetchLocations} disabled={isRefreshing}>
            <Text style={styles.reloadButton}>
              {isRefreshing ? "Refreshing..." : "Reload"}
            </Text>
          </TouchableOpacity>
        </View>
        {locations.map((location) => (
          <Text key={location.id} style={styles.locationItem}>
            {location.title}
          </Text>
        ))}
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
