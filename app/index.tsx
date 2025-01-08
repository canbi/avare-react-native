import React, { useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { IconSymbol } from "@/components/icon/IconSymbol";
import AppBottomSheet from "@/components/sheet/AppBottomSheet";

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const profileSheetRef = useRef<BottomSheet>(null);

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Text>Home Screen</Text>

      <AppBottomSheet
        ref={bottomSheetRef}
        showCloseButton={false}
        canDragToClose={false}
      >
        <BottomSheetScrollView style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Main Sheet</Text>
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.snapToIndex(0);
                profileSheetRef.current?.snapToIndex(1);
              }}
            >
              <IconSymbol
                size={28}
                name="person.crop.circle.fill"
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <Text>Awesome 🎉</Text>
        </BottomSheetScrollView>
      </AppBottomSheet>

      <AppBottomSheet ref={profileSheetRef} initialPosition={-1}>
        <BottomSheetScrollView style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile Sheet</Text>
          </View>
          <Text>Awesome 🎉</Text>
        </BottomSheetScrollView>
      </AppBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});
