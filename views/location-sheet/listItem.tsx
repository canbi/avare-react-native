import { List } from "@/repository/domain/list";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import LocationItem from "./locationItem";
import { Location } from "@/repository/domain/location";
import { getLocationsForList } from "@/repository/services/listService";

const ListItem = ({ list }: { list: List }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedLocations = await getLocationsForList(list.id!);
        setLocations(fetchedLocations);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setError("Failed to fetch locations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [list.id]);

  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{list.title}</Text>

      {isLoading && <ActivityIndicator size="small" color="#0000ff" />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!isLoading && !error && locations.length > 0 ? (
        locations.map((location) => (
          <LocationItem key={location.id!} location={location} />
        ))
      ) : (
        <Text style={styles.noLocationsText}>No locations in this list.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItemText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noLocationsText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 8,
  },
});

export default ListItem;
