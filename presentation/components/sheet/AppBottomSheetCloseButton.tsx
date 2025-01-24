import { useBottomSheet } from "@gorhom/bottom-sheet";
import { Button } from "react-native";

import React from "react";

const AppBottomSheetCloseButton = () => {
  const { close } = useBottomSheet();
  return <Button title="Close" onPress={() => close()} />;
};

export default AppBottomSheetCloseButton;
