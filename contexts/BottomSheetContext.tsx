// contexts/BottomSheetContext.tsx
import React, { createContext, useRef, useContext } from "react";
import BottomSheet from "@gorhom/bottom-sheet";

type BottomSheetContextType = {
  bottomSheetRef: React.RefObject<BottomSheet> | null;
  profileSheetRef: React.RefObject<BottomSheet> | null;
};

const BottomSheetContext = createContext<BottomSheetContextType>({
  bottomSheetRef: null,
  profileSheetRef: null,
});

export const useBottomSheetContext = () => useContext(BottomSheetContext);

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const profileSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef, profileSheetRef }}>
      {children}
    </BottomSheetContext.Provider>
  );
};
