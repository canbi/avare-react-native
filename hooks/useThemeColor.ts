import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  colors: { light: string; dark: string }
) {
  const theme = useColorScheme() ?? 'light';
  return colors[theme];
}