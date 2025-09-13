import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { COLORS } from "./colors";
import { SIZES } from "./sizes";
import { rw, rh } from "../responsive";

/**
 * Общие стилевые константы для переиспользования
 */
export const COMMON_STYLES = {
    // Контейнеры
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    } as ViewStyle,

    centerContainer: {
        flex: 1,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        backgroundColor: COLORS.background,
    } as ViewStyle,

    safeContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: SIZES.padding.lg,
    } as ViewStyle,

    // Карточки
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.borderRadius.medium,
        padding: SIZES.padding.md,
        margin: SIZES.margin.sm,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    } as ViewStyle,

    // Заголовки
    title: {
        fontSize: SIZES.fontSize.xxl,
        fontWeight: "bold" as const,
        color: COLORS.text,
        textAlign: "center" as const,
        marginBottom: SIZES.margin.md,
    } as TextStyle,

    subtitle: {
        fontSize: SIZES.fontSize.lg,
        fontWeight: "600" as const,
        color: COLORS.textSecondary,
        textAlign: "center" as const,
        marginBottom: SIZES.margin.sm,
    } as TextStyle,

    // Текст
    bodyText: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.text,
        lineHeight: SIZES.fontSize.md * 1.5,
    } as TextStyle,

    caption: {
        fontSize: SIZES.fontSize.sm,
        color: COLORS.textSecondary,
        textAlign: "center" as const,
    } as TextStyle,

    errorText: {
        fontSize: SIZES.fontSize.sm,
        color: COLORS.error,
        textAlign: "center" as const,
        marginTop: SIZES.margin.xs,
    } as TextStyle,

    // Кнопки
    buttonContainer: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        marginTop: SIZES.margin.md,
    } as ViewStyle,

    buttonRow: {
        flexDirection: "row" as const,
        justifyContent: "space-around" as const,
        alignItems: "center" as const,
        marginVertical: SIZES.margin.md,
    } as ViewStyle,

    // Формы
    formContainer: {
        width: rw(90),
        alignSelf: "center" as const,
    } as ViewStyle,

    inputContainer: {
        marginBottom: SIZES.margin.md,
    } as ViewStyle,

    // Списки
    listContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    } as ViewStyle,

    listItem: {
        backgroundColor: COLORS.surface,
        padding: SIZES.padding.md,
        marginVertical: SIZES.margin.xs,
        marginHorizontal: SIZES.margin.sm,
        borderRadius: SIZES.borderRadius.medium,
        flexDirection: "row" as const,
        alignItems: "center" as const,
    } as ViewStyle,

    // Иконки
    iconContainer: {
        justifyContent: "center" as const,
        alignItems: "center" as const,
        marginBottom: SIZES.margin.md,
    } as ViewStyle,

    // Разделители
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SIZES.margin.md,
    } as ViewStyle,

    // Загрузка
    loadingContainer: {
        flex: 1,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        backgroundColor: COLORS.background,
    } as ViewStyle,

    // Модальные окна
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center" as const,
        alignItems: "center" as const,
    } as ViewStyle,

    modalContent: {
        backgroundColor: COLORS.background,
        borderRadius: SIZES.borderRadius.large,
        padding: SIZES.padding.lg,
        margin: SIZES.margin.md,
        minWidth: rw(80),
        maxWidth: rw(90),
        maxHeight: rh(80),
    } as ViewStyle,
} as const;

/**
 * Создание StyleSheet из общих стилей
 */
export const createCommonStyles = () => StyleSheet.create(COMMON_STYLES);

export default COMMON_STYLES;
