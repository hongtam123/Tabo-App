import { StyleSheet } from "react-native";
import Root from "./src/navigations/Root";
import { NativeBaseProvider } from "native-base";
import appTheme from "./src/theme";

import { Provider } from "react-redux";
import store from "./src/store";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  let [fontsLoaded] = useFonts({
    "WixMadeforText-Regular": require("./assets/fonts/WixMadeforText-Regular.ttf"),
    "WixMadeforText-Medium": require("./assets/fonts/WixMadeforText-Medium.ttf"),
    "WixMadeforText-Italic": require("./assets/fonts/WixMadeforText-Italic.ttf"),
    "WixMadeforText-Bold": require("./assets/fonts/WixMadeforText-Bold.ttf"),
    "WixMadeforText-BoldItalic": require("./assets/fonts/WixMadeforText-BoldItalic.ttf"),
    "WixMadeforText-SemiBold": require("./assets/fonts/WixMadeforText-SemiBold.ttf"),
    "WixMadeforText-SemiBoldItalic": require("./assets/fonts/WixMadeforText-SemiBoldItalic.ttf"),
    "WixMadeforText-ExtraBold": require("./assets/fonts/WixMadeforText-ExtraBold.ttf"),
    "WixMadeforText-ExtraBoldItalic": require("./assets/fonts/WixMadeforText-ExtraBoldItalic.ttf"),
    "WixMadeforText-MediumItalic": require("./assets/fonts/WixMadeforText-MediumItalic.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NativeBaseProvider theme={appTheme}>
      <Provider store={store}>
        <Root />
      </Provider>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
