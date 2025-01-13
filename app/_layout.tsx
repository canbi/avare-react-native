import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppAssets } from "@/constants/AppAssets";
import i18n from "@/i18n/i18n";
import { useColorScheme } from "@/hooks/useColorSchema/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { initDatabase } from "@/repository/database/databaseRepository";
import { BottomSheetProvider } from "@/contexts/BottomSheetContext";

SplashScreen.preventAutoHideAsync();

const initI18n = i18n;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({ SpaceMono: AppAssets.fonts.spaceMono.regular });
  const isDatabaseInitialized = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (!isDatabaseInitialized.current) {
        await initDatabase();
        isDatabaseInitialized.current = true;
      }

      if (loaded) await SplashScreen.hideAsync();
    };

    initializeApp();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <BottomSheetProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </BottomSheetProvider>
  );
}
