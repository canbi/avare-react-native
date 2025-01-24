import { View, StyleSheet } from 'react-native';
import React, { forwardRef, useCallback, useMemo } from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import AppBottomSheetCloseButton from './AppBottomSheetCloseButton';
import { AppColors } from '@/utils/AppColors';
import { useThemeColor } from '@/utils/UseThemeColor';

export type Ref = BottomSheet;

interface Props {
  snapPoints?: (string | number)[];
  initialPosition?: number;
  canDragToClose?: boolean;
  showCloseButton?: boolean;
  backdropStartIndex?: number;
  backdropPressBehavior?: number | 'none' | 'close' | 'collapse';
  children: React.ReactNode;
}

const AppBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const {
    snapPoints = ['16%', '50%', '90%'],
    initialPosition = 1,
    canDragToClose = true,
    showCloseButton = true,
    backdropStartIndex = snapPoints.length - 1,
    backdropPressBehavior = 1,
    children,
  } = props;

  const themeBackgroundColor = useThemeColor(AppColors.sheet?.background);
  const themeHandleColor = useThemeColor(AppColors.sheet?.handle);
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={backdropStartIndex}
        disappearsOnIndex={backdropStartIndex - 1}
        pressBehavior={backdropPressBehavior}
        {...props}
      />
    ),
    [backdropStartIndex, backdropPressBehavior]
  );

  return (
    <BottomSheet
      ref={ref}
      index={initialPosition}
      snapPoints={memoizedSnapPoints}
      enablePanDownToClose={canDragToClose}
      enableDynamicSizing={false}
      handleComponent={null}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: 'transparent' }}
    >
      <View style={[styles.overlay, { backgroundColor: themeBackgroundColor }]}>
        <View style={styles.customHandle}>
          <View style={[styles.handleIndicator, { backgroundColor: themeHandleColor }]} />
        </View>

        {/* BottomSheet Content */}
        <View style={styles.container}>
          {children}
          {showCloseButton && (
            <View style={styles.closeButtonContainer}>
              <AppBottomSheetCloseButton />
            </View>
          )}
        </View>
      </View>
    </BottomSheet>
  );
});

AppBottomSheet.displayName = 'AppBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 16,
  },
  blurBackground: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  customHandle: {
    alignItems: 'center',
    paddingVertical: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
});

export default AppBottomSheet;
