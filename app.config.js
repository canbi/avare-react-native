const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";
const IS_PROD = process.env.APP_VARIANT === "production";

export default {
  name: IS_DEV ? "avare-react-native (Dev)" : "avare-react-native",
  slug: "avare-react-native",
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? "com.myapp.dev" : "com.myapp",
  },
  android: {
    package: IS_DEV ? "com.myapp.dev" : "com.myapp",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    [
      "expo-sqlite",
      {
        enableFTS: true,
        useSQLCipher: true,
      },
    ],
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "0ce566ee-bbeb-43ce-bf15-17db0a34a879",
    },
  },
};
