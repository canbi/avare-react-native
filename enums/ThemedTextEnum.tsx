import { AppColors } from "@/constants/AppColors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";

enum ThemedTextType {
  default,
  title,
  defaultSemiBold,
  subtitle,
  link,
}

export const getTextThemeStyle = (themeTextType: ThemedTextType) => {
  switch (themeTextType) {
    case ThemedTextType.default:
      return styles.default;
    case ThemedTextType.title:
      return styles.title;
    case ThemedTextType.defaultSemiBold:
      return styles.defaultSemiBold;
    case ThemedTextType.subtitle:
      return styles.subtitle;
    case ThemedTextType.link:
      return styles.link;
    default:
      return styles.default;
  }
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: AppColors.default.link.light,
  },
});

export default ThemedTextType;
