import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button } from 'react-native';
import { Location, List, Note } from '@/presentation/_domain';
import * as SQLite from 'expo-sqlite';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useBottomSheetContext } from '@/presentation/_logic/BottomSheetContext';
import { deleteAndRecreateDatabase } from '@/presentation/_infrastructure/DatabaseRepository';
import debounce from '@/utils/Debounce';
import { AppColors } from '@/utils/AppColors';
import { useThemeColor } from '@/utils/UseThemeColor';
import { createListWithLocations, getLists } from '../_infrastructure/services/ListService';
import LocationItem from './subviews/LocationItem';
import ListItem from './subviews/ListItem';
import { IconSymbol } from '../components/icon/IconSymbol';
import { ThemedText } from '../components/themed/themedText';
import { createLocationWithListsAndNotes, getLocations } from '../_infrastructure/services/LocationService';

const MainSheetBody = () => {
  const { bottomSheetRef, profileSheetRef } = useBottomSheetContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [isRefreshingList, setIsRefreshingList] = useState(false);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchLocations = async () => {
    setIsRefreshingLocation(true);
    const fetchedLocations = await getLocations();

    if (!fetchedLocations.isSuccess) {
      console.error('Failed to fetch locations:', fetchedLocations.error);
      setIsRefreshingLocation(false);
      return;
    }

    setLocations(fetchedLocations.getValue());
    setIsRefreshingLocation(false);
  };

  const fetchLists = async () => {
    setIsRefreshingList(true);
    const fetchedLists = await getLists();

    if (!fetchedLists.isSuccess) {
      console.error('Failed to fetch lists:', fetchedLists.error);
      setIsRefreshingList(false);
      return;
    }

    setLists(fetchedLists.getValue());
    setIsRefreshingList(false);
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchLocations();
      await fetchLists();

      const subscription = SQLite.addDatabaseChangeListener(() => {
        const debouncedFetch = debounce(() => {
          fetchLocations();
          fetchLists();
        }, 300);
        debouncedFetch();
      });

      setIsLoaded(true);
      return () => {
        subscription.remove();
      };
    };

    if (!isLoaded) initialize();
  }, [isLoaded]);

  // DUMMY STUFF
  const handleCreateDummyNote = async (): Promise<Omit<Note, 'id'>> => {
    const note: Omit<Note, 'id'> = {
      description: 'This is a dummy note',
      date: new Date().toISOString(),
      write_date: new Date().toISOString(),
    };
    return note;
  };

  const handleCreateDummyLocation = async (): Promise<Location> => {
    const location: Omit<Location, 'id'> = {
      latitude: 37.7749,
      longitude: -122.4194,
      title: 'Dummy Location',
      description: 'This is a dummy location',
      emoji: '📍',
      color: '#FF0000',
      is_cover_empty: false,
      country: 'USA',
      country_code: 'US',
      local_address: 'San Francisco, CA',
      write_date: new Date().toISOString(),
      photo_ids: '',
    };

    const notes: Omit<Note, 'id'>[] = [];
    for (let i = 0; i < 3; i++) {
      const note = await handleCreateDummyNote();
      notes.push(note);
    }

    const locationId = await createLocationWithListsAndNotes(location, [], notes);
    if (!locationId.isSuccess) throw new Error('Failed to create dummy location');

    return { ...location, id: locationId.getValue() };
  };

  const handleCreateDummyList = async () => {
    try {
      const list: Omit<List, 'id'> = {
        title: 'Dummy List',
        description: 'This is a dummy list',
        emoji: '📝',
        write_date: new Date().toISOString(),
      };

      const locations: number[] = [];
      for (let i = 0; i < 2; i++) {
        const location = await handleCreateDummyLocation();
        locations.push(location.id!);
      }

      const listId = await createListWithLocations(list, locations);
      if (!listId.isSuccess) throw new Error('Failed to create dummy list');
    } catch (error) {
      console.error('Error creating dummy list:', error);
    }
  };

  const handleDeleteAndRecreateDatabase = async () => {
    try {
      await deleteAndRecreateDatabase();
      console.log('Database deleted and recreated successfully');
    } catch (error) {
      console.error('Error deleting and recreating database:', error);
    }
  };

  return (
    <BottomSheetScrollView style={styles.contentContainer}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Main Sheet</ThemedText>
        <TouchableOpacity
          onPress={() => {
            bottomSheetRef?.current?.snapToIndex(0);
            profileSheetRef?.current?.snapToIndex(0);
          }}
        >
          <IconSymbol size={28} name="person.crop.circle.fill" color={useThemeColor(AppColors.default.text)} />
        </TouchableOpacity>
      </View>
      <Button title="Create Dummy List" onPress={handleCreateDummyList} />
      <Button title="Delete and Recreate Database" onPress={handleDeleteAndRecreateDatabase} />

      <View style={styles.container}>
        {/* Lists Section */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Lists</ThemedText>
          <TouchableOpacity onPress={fetchLists} disabled={isRefreshingList}>
            <Text style={styles.reloadButton}>{isRefreshingList ? 'Refreshing...' : 'Reload'}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={lists}
          renderItem={({ item }: { item: List }) => {
            return <ListItem key={item.id} list={item} />;
          }}
          keyExtractor={(item) => item.id!.toString()}
          scrollEnabled={false}
        />

        <View style={{ height: 16 }} />

        {/* Locations Section */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Locations</ThemedText>
          <TouchableOpacity onPress={fetchLocations} disabled={isRefreshingLocation}>
            <Text style={styles.reloadButton}>{isRefreshingLocation ? 'Refreshing...' : 'Reload'}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={locations}
          renderItem={({ item }: { item: Location }) => {
            return <LocationItem key={item.id} location={item} />;
          }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  reloadButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  locationItem: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default MainSheetBody;
