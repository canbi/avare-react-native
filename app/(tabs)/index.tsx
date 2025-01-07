import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextType from "@/enums/ThemedTextEnum";
import { ThemedView } from '@/components/ThemedView';
import { Assets } from '@/constants/Assets';
import { AppColors } from '@/constants/Colors';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={AppColors.home.header}
      headerImage={
        <Image
          source={Assets.images.home.header}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type={ThemedTextType.title}>Welcome!</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
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
