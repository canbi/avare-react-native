import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextType from "@/enums/ThemedTextEnum";
import { ThemedView } from '@/components/ThemedView';
import { AppAssets } from '@/constants/AppAssets';
import { AppColors } from '@/constants/AppColors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getTranslation, TranslationKeys } from '@/i18n/translation-keys';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
    headerBackgroundColor={useThemeColor(AppColors.home.header)}
      headerImage={
        <Image
          source={AppAssets.images.home.header}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type={ThemedTextType.title}>{getTranslation(TranslationKeys.HOME_TITLE)}</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
