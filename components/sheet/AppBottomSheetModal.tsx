import React, { forwardRef, useCallback, useMemo } from "react";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";

export type Ref = BottomSheetModal;

interface Props {
  snapPoints?: (string | number)[];
  children: React.ReactNode;
  backdropStartIndex?: number;
  backdropPressBehavior?: number | "none" | "close" | "collapse";
}

const AppBottomSheetModal = forwardRef<Ref, Props>((props, ref) => {
  const {
    snapPoints = ["25%", "50%", "90%"],
    children,
    backdropStartIndex = 2,
    backdropPressBehavior = 1,
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
    <BottomSheetModal
      ref={ref}
      index={1}
      snapPoints={memoizedSnapPoints}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
    >
      {children}
    </BottomSheetModal>
  );
});

AppBottomSheetModal.displayName = "AppBottomSheetModal";

export default AppBottomSheetModal;
