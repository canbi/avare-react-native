import { Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedTextType, { getTextThemeStyle } from "@/enums/themed-text-enum";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemedTextType;
};

export function ThemedText({ style, lightColor, darkColor, type = ThemedTextType.default, ...rest }: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <Text style={[{ color }, getTextThemeStyle(type), style]} {...rest} />;
}
