// LocationItem.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useStore } from 'zustand';

import { Location } from '@/presentation/_domain';
import { useThemeColor } from '@/utils/UseThemeColor';
import { AppColors } from '@/utils/AppColors';
import { ThemedText } from '@/presentation/components/themed/themedText/ThemedText';
import { IconSymbol } from '@/presentation/components/icon/IconSymbol';
import { createLocationItemStore } from './_logic/LocationItemStore';

interface LocationItemProps {
  location: Location;
}

const LocationItem: React.FC<LocationItemProps> = ({ location }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 1) Create a new store instance just for this location item
  const storeRef = useRef(createLocationItemStore()).current;

  // 2) Subscribe to the store’s state + action
  const notes = useStore(storeRef, (state) => state.notes);
  const isLoading = useStore(storeRef, (state) => state.isLoading);
  const error = useStore(storeRef, (state) => state.error);
  const fetchNotesForLocation = useStore(storeRef, (state) => state.fetchNotesForLocation);

  // 3) Whenever isExpanded becomes true, fetch the notes
  useEffect(() => {
    if (isExpanded) {
      fetchNotesForLocation(location.id!);
    }
  }, [isExpanded, location.id, fetchNotesForLocation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.locationHeader}>
        <ThemedText style={styles.locationTitle}>{location.title}</ThemedText>
        <IconSymbol
          size={20}
          name={isExpanded ? 'chevron.up' : 'chevron.down'}
          color={useThemeColor(AppColors.default.text)}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.notesContainer}>
          {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

          {!isLoading &&
            !error &&
            notes.map((note) => (
              <ThemedText key={note.id} style={styles.noteText}>
                {note.description}
              </ThemedText>
            ))}

          {!isLoading && !error && notes.length === 0 && (
            <ThemedText style={styles.noteText}>No notes for this location.</ThemedText>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 8,
    paddingLeft: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 4,
  },
});

export default LocationItem;
