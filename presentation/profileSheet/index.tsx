import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../components/themed/themedText/ThemedText';

const ProfileSheetBody = () => {
  return (
    <BottomSheetScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Profile</ThemedText>
      </View>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfileSheetBody;
