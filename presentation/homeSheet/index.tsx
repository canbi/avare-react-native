// presentation/MainSheetBody.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { useBottomSheetContext } from '@/presentation/_logic/BottomSheetContext';

// Domain-specific store hooks
import { useLocationStore } from './_logic/LocationStore';
import { useListStore } from './_logic/ListStore';

// Domain-specific logic
import { handleDeleteAndRecreateDatabase } from './_logic/DatabaseLogic';

// Domain types
import { Location, List } from '@/presentation/_domain';

// Child components
import LocationItem from './subviews/locationItem/LocationItem';
import ListItem from './subviews/listItem/ListItem';
import { IconSymbol } from '../components/icon/IconSymbol';
import { ThemedText } from '../components/themed/themedText';
import { useThemeColor } from '@/utils/UseThemeColor';
import { AppColors } from '@/utils/AppColors';

export default function MainSheetBody() {
  const { bottomSheetRef, profileSheetRef } = useBottomSheetContext();
  const { locations, isRefreshingLocation, initializeLocations, fetchLocations, createDummyLocation } =
    useLocationStore();
  const { lists, isRefreshingList, initializeLists, fetchLists, createDummyList } = useListStore();

  useEffect(() => {
    let unsubscribeLocations: (() => void) | undefined;
    let unsubscribeLists: (() => void) | undefined;

    (async function init() {
      unsubscribeLocations = await initializeLocations();
      unsubscribeLists = await initializeLists();
    })();

    // Cleanup
    return () => {
      unsubscribeLocations?.();
      unsubscribeLists?.();
    };
  }, [initializeLists, initializeLocations]);

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

      <Button title="Create Dummy List" onPress={createDummyList} />
      <Button title="Create Dummy Location" onPress={createDummyLocation} />
      <Button title="Delete & Recreate DB" onPress={handleDeleteAndRecreateDatabase} />

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
          renderItem={({ item }: { item: List }) => <ListItem key={item.id} list={item} />}
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
          renderItem={({ item }: { item: Location }) => <LocationItem key={item.id} location={item} />}
          keyExtractor={(item) => item.id!.toString()}
          scrollEnabled={false}
        />
      </View>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  container: {
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
});
