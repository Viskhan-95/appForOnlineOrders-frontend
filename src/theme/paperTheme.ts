import {
    MD3DarkTheme as DefaultDarkTheme,
    configureFonts,
    MD3Typescale,
} from "react-native-paper";
import { COLORS } from "../utils/constans/colors";

const fonts: Partial<MD3Typescale> = {};

export const paperDarkTheme = {
    ...DefaultDarkTheme,
    dark: true,
    roundness: 4,
    colors: {
        ...DefaultDarkTheme.colors,
        primary: COLORS.textLink,
        onPrimary: COLORS.background,
        background: COLORS.background,
        surface: COLORS.secondary,
        onSurface: COLORS.text,
        surfaceVariant: COLORS.secondary,
        outline: COLORS.textSubtitle,
        error: COLORS.error,
    },
    fonts: configureFonts({ config: fonts }),
};



