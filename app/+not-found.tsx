import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import ThemedTextType from "@/enums/ThemedTextEnum";
import { ThemedView } from '@/components/ThemedView';
import { getTranslation, TranslationKeys } from '@/i18n/translation-keys';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type={ThemedTextType.title}>{getTranslation(TranslationKeys.NOT_FOUND_TITLE)}</ThemedText>
        <ThemedText type={ThemedTextType.default}>{getTranslation(TranslationKeys.NOT_FOUND_DESCRIPTION)}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type={ThemedTextType.link}>{getTranslation(TranslationKeys.NOT_FOUND_GO_HOME)}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
