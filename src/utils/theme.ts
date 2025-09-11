import { COLORS } from "./constans/colors";
import { SIZES } from "./constans/sizes";
import { TYPOGRAPHY } from "./constans/typography";
import { StatusBar } from "expo-status-bar";

export const DarkTheme = {
    colors: COLORS,
    sizes: SIZES,
    typography: TYPOGRAPHY,
} as const;

export function applyDarkStatusBar() {
    return <StatusBar style="light" />;
}
