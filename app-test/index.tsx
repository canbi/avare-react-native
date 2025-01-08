import React, { useCallback, useRef, useMemo, useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import BottomSheet, { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';

export default function HomeScreen() {
  const firstBottomSheetRef = useRef<BottomSheet>(null);
  const secondBottomSheetRef = useRef<BottomSheet>(null);

  // Snap points for both bottom sheets
  const firstSnapPoints = useMemo(() => ['18%', '50%', '90%'], []);
  const secondSnapPoints = useMemo(() => ['70%'], []);

  // Animation configs
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  // Handlers for the first bottom sheet
  const handleSnapPress = useCallback((index: number) => {
    firstBottomSheetRef.current?.snapToIndex(index);
  }, []);

  const handleCollapsePress = useCallback(() => {
    firstBottomSheetRef.current?.collapse();
  }, []);

  const handleClosePress = useCallback(() => {
    firstBottomSheetRef.current?.close();
  }, []);

  // Handlers for the second bottom sheet
  const openSecondBottomSheet = useCallback(() => {
    secondBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeSecondBottomSheet = useCallback(() => {
    secondBottomSheetRef.current?.close();
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Text>Home Screen</Text>
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Collapse" onPress={handleCollapsePress} />
      <Button title="Close" onPress={handleClosePress} />
      
      <BottomSheet
        ref={firstBottomSheetRef}
        index={1}
        snapPoints={firstSnapPoints}
        animationConfigs={animationConfigs}
        animateOnMount={true}
        enableDynamicSizing={false}
      >
        <View style={styles.bottomSheetContent}>
          <Text>First Bottom Sheet Content</Text>
          <Button title="Open Second Bottom Sheet" onPress={openSecondBottomSheet} />
        </View>
      </BottomSheet>

      <BottomSheet
        ref={secondBottomSheetRef}
        index={-1}
        snapPoints={secondSnapPoints}
        animationConfigs={animationConfigs}
        animateOnMount={true}
        enableDynamicSizing={false}
      >
        <View style={styles.bottomSheetContent}>
          <Text>Profile</Text>
          <Button title="Close Second Bottom Sheet" onPress={closeSecondBottomSheet} />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
});