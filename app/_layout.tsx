import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppAssets } from "@/constants/AppAssets";
import i18n from "@/i18n/i18n";

import { useColorScheme } from '@/hooks/useColorScheme';
import { useTranslation } from 'react-i18next';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const initI18n = i18n;
export default function RootLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: AppAssets.fonts.spaceMono.regular,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={({ route }) => ({
          headerShown: false,
          title: t('home_tab_title'),
        })} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
