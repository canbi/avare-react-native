import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getLocations } from "@/repository/services/locationService";
import { Location } from "@/repository/domain";
import * as SQLite from "expo-sqlite";

const LocationsSheetBody = () => {
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

      const subscription = SQLite.addDatabaseChangeListener((event) => {
        console.log(
          "Database changed! Refetching locations... and event:",
          event
        );
        fetchLocations();
      });

      return () => {
        subscription.remove();
      };
    };

    initialize();
  }, []);

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
