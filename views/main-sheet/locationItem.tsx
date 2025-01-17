import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/icon/IconSymbol';
import { getNotesForLocation } from '@/repository/services/noteService';
import { Location, Note } from '@/repository/domain';
import { ThemedText } from '@/components/themed/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AppColors } from '@/constants/AppColors';

interface LocationItemProps {
  location: Location;
}

const LocationItem: React.FC<LocationItemProps> = ({ location }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await getNotesForLocation(location.id!);
      if (!fetchedNotes.isSuccess) {
        throw new Error('Failed to fetch notes.');
      }

      setNotes(fetchedNotes.getValue());
    };

    if (isExpanded) {
      fetchNotes();
    }
  }, [isExpanded, location.id]);

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
          {notes.map((note) => (
            <ThemedText key={note.id} style={styles.noteText}>
              {note.description}
            </ThemedText>
          ))}
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
});

export default LocationItem;
