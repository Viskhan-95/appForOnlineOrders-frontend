import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BaseModal from "./BaseModal";
import Button from "../ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../utils/constants/colors";
import { SIZES } from "../../utils/constants/sizes";
import { rh, rw } from "../../utils/responsive";

export type ModalType = "error" | "success" | "info" | "confirm";

interface UniversalModalProps {
    visible: boolean;
    onClose: () => void;
    type: ModalType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCloseButton?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

const UniversalModal: React.FC<UniversalModalProps> = React.memo(
    ({
        visible,
        onClose,
        type,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        showCloseButton = true,
        autoClose = false,
        autoCloseDelay = 5000,
    }) => {
        // Автоматическое закрытие
        React.useEffect(() => {
            if (visible && autoClose) {
                const timer = setTimeout(() => {
                    onClose();
                }, autoCloseDelay);
                return () => clearTimeout(timer);
            }
        }, [visible, autoClose, autoCloseDelay, onClose]);

        // Конфигурация для разных типов модальных окон
        const modalConfig = {
            error: {
                iconText: "!",
                gradientColors: GRADIENT_COLORS.error,
                defaultConfirmText: "Понятно",
                defaultCancelText: "Отмена",
            },
            success: {
                iconText: "✓",
                gradientColors: GRADIENT_COLORS.success,
                defaultConfirmText: "Отлично",
                defaultCancelText: "Закрыть",
            },
            info: {
                iconText: "i",
                gradientColors: GRADIENT_COLORS.info,
                defaultConfirmText: "Понятно",
                defaultCancelText: "Закрыть",
            },
            confirm: {
                iconText: "?",
                gradientColors: GRADIENT_COLORS.warning,
                defaultConfirmText: "Подтвердить",
                defaultCancelText: "Отмена",
            },
        };

        const config = modalConfig[type];

        const handleConfirm = () => {
            if (onConfirm) {
                onConfirm();
            }
            onClose();
        };

        const handleCancel = () => {
            if (onCancel) {
                onCancel();
            }
            onClose();
        };

        return (
            <BaseModal visible={visible} onClose={onClose}>
                <View style={styles.container}>
                    {/* Иконка */}
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={config.gradientColors}
                            style={styles.iconGradient}
                        >
                            <Text style={styles.iconText}>
                                {config.iconText}
                            </Text>
                        </LinearGradient>
                    </View>

                    {/* Заголовок */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Сообщение */}
                    <Text style={styles.message}>{message}</Text>

                    {/* Кнопки */}
                    <View style={styles.buttonContainer}>
                        {showCloseButton && (
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleCancel}
                            >
                                <Text style={styles.closeButtonText}>
                                    {cancelText || config.defaultCancelText}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <Button
                            gradientColors={config.gradientColors}
                            textColor={COLORS.background}
                            onPress={handleConfirm}
                            style={styles.primaryButton}
                        >
                            <Text>
                                {confirmText || config.defaultConfirmText}
                            </Text>
                        </Button>
                    </View>
                </View>
            </BaseModal>
        );
    }
);

UniversalModal.displayName = "UniversalModal";

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        borderRadius: SIZES.borderRadius.large,
        padding: SIZES.padding.lg,
        alignItems: "center",
        minWidth: rw(70),
        maxWidth: rw(80),
    },
    iconContainer: {
        marginBottom: SIZES.margin.md,
    },
    iconGradient: {
        width: SIZES.icon.large,
        height: SIZES.icon.large,
        borderRadius: SIZES.icon.large / 2,
        justifyContent: "center",
        alignItems: "center",
    },
    iconText: {
        fontSize: SIZES.fontSize.xxl,
        fontWeight: "bold",
        color: COLORS.background,
    },
    title: {
        fontSize: SIZES.fontSize.lg,
        fontWeight: "bold",
        color: COLORS.text,
        textAlign: "center",
        marginBottom: SIZES.margin.sm,
    },
    message: {
        fontSize: SIZES.fontSize.sm,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: SIZES.margin.md,
        lineHeight: SIZES.fontSize.md,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: SIZES.padding.sm,
    },
    closeButton: {
        flex: 1,
        paddingVertical: SIZES.padding.sm,
        paddingHorizontal: SIZES.padding.md,
        borderRadius: SIZES.borderRadius.medium,
        backgroundColor: COLORS.backgroundSecondary,
        alignItems: "center",
    },
    closeButtonText: {
        color: COLORS.text,
        fontSize: SIZES.fontSize.sm,
        fontWeight: "500",
    },
    primaryButton: {
        flex: 1,
    },
});

export default UniversalModal;
