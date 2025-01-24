import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/utils/UseThemeColor';
import ThemedTextType, { getTextThemeStyle } from '@/presentation/components/themed/themedText/ThemedTextEnum';
import { AppColors } from '@/utils/AppColors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemedTextType;
};

export function ThemedText({ style, lightColor, darkColor, type = ThemedTextType.default, ...rest }: ThemedTextProps) {
  const color = useThemeColor({
    light: lightColor || AppColors.default.text.light,
    dark: darkColor || AppColors.default.text.dark,
  });
  return <Text style={[{ color }, getTextThemeStyle(type), style]} {...rest} />;
}
