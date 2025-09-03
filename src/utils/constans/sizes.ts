import {
    getResponsiveFontSize,
    getResponsiveSize,
    rh,
    rw,
} from "../responsive";

export const SIZES = {
    // Отступы внутренние
    padding: {
        xs: rw(1),
        sm: rw(2),
        md: rw(4),
        lg: rw(6),
        xl: rw(8),
        xxl: rw(12),
    },
    // Отступы внешние
    margin: {
        xs: rh(1),
        sm: rh(2),
        md: rh(3),
        lg: rh(5),
        xl: rh(8),
        xxl: rh(12),
    },
    // Размеры шрифтов
    fontSize: {
        xs: getResponsiveFontSize(12),
        sm: getResponsiveFontSize(14),
        md: getResponsiveFontSize(16),
        lg: getResponsiveFontSize(18),
        xl: getResponsiveFontSize(20),
        xxl: getResponsiveFontSize(24),
        title: getResponsiveFontSize(28),
        largeTitle: getResponsiveFontSize(32),
    },
    // Responsive размеры компонентов
    button: {
        height: rh(6),
        borderRadius: rw(2),
    },

    input: {
        height: rh(6),
        borderRadius: rw(2),
    },

    card: {
        borderRadius: rw(3),
        padding: rw(4),
    },

    // Responsive размеры для разных устройств
    icon: {
        small: getResponsiveSize(16, 18, 20),
        medium: getResponsiveSize(24, 28, 32),
        large: getResponsiveSize(32, 36, 40),
    },
} as const;
