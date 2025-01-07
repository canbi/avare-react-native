import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextType from "@/enums/ThemedTextEnum";
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AppColors } from '@/constants/AppColors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getTranslation, TranslationKeys } from '@/i18n/translation-keys';
import { Link } from 'expo-router';

export default function TabTwoScreen() {
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={useThemeColor(AppColors.explore.header)}
      headerImage={
        <IconSymbol
          size={310}
          color={useThemeColor(AppColors.explore.icon)}
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type={ThemedTextType.title}>{getTranslation(TranslationKeys.EXPLORE_TITLE)}</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
