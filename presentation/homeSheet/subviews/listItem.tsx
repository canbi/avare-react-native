import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getLocationsForList } from '@/presentation/_infrastructure/services/ListService';
import LocationItem from './LocationItem';
import { Location, List } from '@/presentation/_domain';
import { ThemedText } from '@/presentation/components/themed/themedText/ThemedText';

const ListItem = ({ list }: { list: List }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);

      const fetchedLocations = await getLocationsForList(list.id!);
      if (!fetchedLocations.isSuccess) {
        setError('Failed to fetch locations.');
        setIsLoading(false);
        return;
      }

      setLocations(fetchedLocations.getValue());
      setIsLoading(false);
    };

    fetchLocations();
  }, [list.id]);

  return (
    <View style={styles.listItem}>
      <ThemedText style={styles.listItemText}>{list.title}</ThemedText>

      {isLoading && <ActivityIndicator size="small" color="#0000ff" />}

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

      {!isLoading && !error && locations.length > 0 ? (
        locations.map((location) => <LocationItem key={location.id!} location={location} />)
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
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noLocationsText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 8,
  },
});

export default ListItem;
