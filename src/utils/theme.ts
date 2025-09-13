import { COLORS } from "./constants/colors";
import { SIZES } from "./constants/sizes";
import { TYPOGRAPHY } from "./constants/typography";
import { StatusBar } from "expo-status-bar";

export const DarkTheme = {
    colors: COLORS,
    sizes: SIZES,
    typography: TYPOGRAPHY,
} as const;

export function applyDarkStatusBar() {
    return <StatusBar style="light" />;
}
