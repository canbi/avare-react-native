import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/icon/IconSymbol";
import { getNotesForLocation } from "@/repository/services/noteService";
import { Location, Note } from "@/repository/domain";

interface LocationItemProps {
  location: Location;
}

const LocationItem: React.FC<LocationItemProps> = ({ location }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotesForLocation(location.id!);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    if (isExpanded) {
      fetchNotes();
    }
  }, [isExpanded, location.id]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.locationHeader}
      >
        <Text style={styles.locationTitle}>{location.title}</Text>
        <IconSymbol
          size={20}
          name={isExpanded ? "chevron.up" : "chevron.down"}
          color="#000"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.notesContainer}>
          {notes.map((note) => (
            <Text key={note.id} style={styles.noteText}>
              {note.description}
            </Text>
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
    borderBottomColor: "#ccc",
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  notesContainer: {
    marginTop: 8,
    paddingLeft: 16,
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
});

export default LocationItem;
