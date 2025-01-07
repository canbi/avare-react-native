import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import ThemedTextType from "@/enums/ThemedTextEnum";
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type={ThemedTextType.title}>{t('not_found_title')}</ThemedText>
        <ThemedText type={ThemedTextType.default}>{t('not_found_description')}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type={ThemedTextType.link}>{t('not_found_go_home')}</ThemedText>
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
