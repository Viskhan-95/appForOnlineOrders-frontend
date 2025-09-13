import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { COMMON_STYLES } from "../utils/constants/styles";
import { COLORS } from "../utils/constants/colors";
import { SIZES } from "../utils/constants/sizes";

/**
 * Хук для использования общих стилей с мемоизацией
 */
export const useCommonStyles = () => {
    return useMemo(() => {
        return StyleSheet.create(COMMON_STYLES);
    }, []);
};

/**
 * Хук для создания кастомных стилей на основе общих
 */
export const useCustomStyles = (customStyles: any) => {
    return useMemo(() => {
        return StyleSheet.create(customStyles);
    }, [customStyles]);
};

/**
 * Хук для получения адаптивных размеров
 */
export const useResponsiveSizes = () => {
    return useMemo(
        () => ({
            padding: SIZES.padding,
            margin: SIZES.margin,
            fontSize: SIZES.fontSize,
            borderRadius: SIZES.borderRadius,
            icon: SIZES.icon,
        }),
        []
    );
};

/**
 * Хук для получения цветовой палитры
 */
export const useColors = () => {
    return useMemo(() => COLORS, []);
};

export default useCommonStyles;
