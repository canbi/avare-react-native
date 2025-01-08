import { Button, View, StyleSheet } from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
export type Ref = BottomSheet;

interface Props {
  snapPoints?: (string | number)[];
  initialPosition?: number;
  canDragToClose?: boolean;
  showCloseButton?: boolean;
  backdropStartIndex?: number;
  backdropPressBehavior?: number | "none" | "close" | "collapse";
  children: React.ReactNode;
}

const CloseBtn = () => {
  const { close } = useBottomSheet();
  return <Button title="Close" onPress={() => close()} />;
};

const AppBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const {
    snapPoints = ["25%", "50%", "90%"],
    initialPosition = 1,
    canDragToClose = true,
    showCloseButton = true,
    backdropStartIndex = 2,
    backdropPressBehavior = 1,
    children,
  } = props;

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
      backdropComponent={renderBackdrop}
    >
      <View style={styles.container}>
        {children}
        {showCloseButton && (
          <View style={styles.closeButtonContainer}>
            <CloseBtn />
          </View>
        )}
      </View>
    </BottomSheet>
  );
});

AppBottomSheet.displayName = "AppBottomSheet";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
});

export default AppBottomSheet;
