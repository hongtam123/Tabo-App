import { extendTheme } from "native-base";

/**
 * Trong cac component co the dung useTheme
 */

export const newColorTheme = {
  primary: {
    Darker: "#311902",
    Dark: "#984D07",
    Main: "#F58216",
    Lighter: "#FDE5CE",
  },
  secondary: {
    Darker: "#311902",
    Dark: "#984D07",
    Main: "#F58216",
    Lighter: "#FDE5CE",
  },
  grey: {
    50: "#F2F2F2",
    100: "#E6E6E6",
    200: "#CCCCCC",
    300: "#B3B3B3",
    400: "#999999",
    500: "#808080",
    600: "#666666",
    700: "#4D4D4D",
    800: "#333333",
    900: "#1A1A1A",
  },
};

const appTheme = extendTheme({
  colors: newColorTheme,
  fontConfig: {
    WixMadeForText: {
      500: {
        normal: "WixMadeforText-Regular",
        italic: "WixMadeforText-Italic",
      },
      600: {
        normal: "WixMadeforText-SemiBold",
        italic: "WixMadeforText-SemiBoldItalic",
      },
      700: {
        normal: "WixMadeforText-Bold",
        italic: "WixMadeforText-BoldItalic",
      },
      800: {
        normal: "WixMadeforText-ExtraBold",
        italic: "WixMadeforText-ExtraBoldItalic",
      },
    },
    fonts: {
      heading: "WixMadeForText",
      body: "WixMadeForText",
      mono: "WixMadeForText",
    },
  },
});

export type AppThemeType = typeof appTheme;
declare module "native-base" {
  interface ICustomTheme extends AppThemeType {}
}
export default appTheme;
