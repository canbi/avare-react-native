import { AppColors } from '@/utils/AppColors';
import { useThemeColor } from '@/utils/UseThemeColor';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({
    light: lightColor || AppColors.default.background.light,
    dark: darkColor || AppColors.default.background.dark,
  });
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
