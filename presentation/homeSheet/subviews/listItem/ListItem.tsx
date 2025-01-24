import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useStore } from 'zustand';
import { List, Location } from '@/presentation/_domain';
import LocationItem from '../locationItem/LocationItem';
import { createListItemStore } from './_logic/ListItemStore';

interface Props {
  list: List;
}

export default function ListItem({ list }: Props) {
  // 1) Create the store instance for this particular ListItem
  const storeRef = useRef(createListItemStore()).current;

  // 2) Subscribe to needed slices of state
  const locations = useStore(storeRef, (state) => state.locations);
  const isLoading = useStore(storeRef, (state) => state.isLoading);
  const error = useStore(storeRef, (state) => state.error);
  const fetchLocationsForList = useStore(storeRef, (state) => state.fetchLocationsForList);

  // 3) On mount, fetch locations for this list
  useEffect(() => {
    fetchLocationsForList(list.id!);
  }, [list.id, fetchLocationsForList]);

  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{list.title}</Text>

      {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!isLoading && !error && locations.length > 0 ? (
        locations.map((loc: Location) => <LocationItem key={loc.id} location={loc} />)
      ) : (
        <Text style={styles.noLocationsText}>No locations in this list.</Text>
      )}
    </View>
  );
}

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
