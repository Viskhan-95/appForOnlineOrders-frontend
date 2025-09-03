import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    widthPercentageToDP,
    heightPercentageToDP,
} from "react-native-responsive-screen";

// Responsive функции
export const responsiveWidth = (percentage: number) => wp(percentage);
export const responsiveHeight = (percentage: number) => hp(percentage);

// Алиасы для удобства
export const rw = wp; // responsive width
export const rh = hp; // responsive height

// Размеры экрана
export const screenWidth = widthPercentageToDP("100%");
export const screenHeight = heightPercentageToDP("100%");

// Breakpoints для разных устройств
export const isSmallDevice = screenWidth < 375;
export const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
export const isLargeDevice = screenWidth >= 414;
export const isTablet = screenWidth >= 768;

// Responsive размеры для разных устройств
export const getResponsiveSize = (
    small: number,
    medium: number,
    large: number
) => {
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    return large;
};

export const getResponsivePadding = (percentage: number) => wp(percentage);
export const getResponsiveMargin = (percentage: number) => wp(percentage);

// Responsive размеры шрифтов
export const getResponsiveFontSize = (size: number) => {
    if (isTablet) return size * 1.2; // Увеличиваем для планшетов
    return size;
};
