import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BaseModal from "./BaseModal";
import Button from "../ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";
import { SIZES } from "../../utils/constans/sizes";
import { rw, rh } from "../../utils/responsive";

interface ConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    type?: "warning" | "danger" | "info";
    showCloseButton?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    onClose,
    title = "Подтверждение",
    message,
    confirmText = "Подтвердить",
    cancelText = "Отмена",
    onConfirm,
    onCancel,
    type = "warning",
    showCloseButton = true,
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onClose();
    };

    const getIconAndColors = () => {
        switch (type) {
            case "danger":
                return {
                    icon: "⚠",
                    gradient: GRADIENT_COLORS.error,
                };
            case "info":
                return {
                    icon: "?",
                    gradient: GRADIENT_COLORS.primary,
                };
            default: // warning
                return {
                    icon: "!",
                    gradient: GRADIENT_COLORS.warning,
                };
        }
    };

    const { icon, gradient } = getIconAndColors();

    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={styles.container}>
                {/* Иконка */}
                <View style={styles.iconContainer}>
                    <LinearGradient
                        colors={gradient}
                        style={styles.iconGradient}
                    >
                        <Text style={styles.iconText}>{icon}</Text>
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
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Закрыть</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                        >
                            <Text style={styles.cancelButtonText}>
                                {cancelText}
                            </Text>
                        </TouchableOpacity>

                        <Button
                            gradientColors={gradient}
                            textColor={COLORS.background}
                            onPress={handleConfirm}
                            style={styles.confirmButton}
                        >
                            <Text>{confirmText}</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </BaseModal>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: rh(2),
    },
    iconContainer: {
        marginBottom: rh(2),
    },
    iconGradient: {
        width: rw(15),
        height: rw(15),
        borderRadius: rw(7.5),
        justifyContent: "center",
        alignItems: "center",
    },
    iconText: {
        fontSize: SIZES.fontSize.xxl,
        fontWeight: "bold",
        color: COLORS.background,
    },
    title: {
        fontSize: SIZES.fontSize.xl,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        textAlign: "center",
        marginBottom: rh(1),
    },
    message: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: SIZES.fontSize.md * 1.4,
        marginBottom: rh(3),
        paddingHorizontal: rw(2),
    },
    buttonContainer: {
        width: "100%",
        gap: rh(1.5),
    },
    closeButton: {
        paddingVertical: rh(1),
        paddingHorizontal: rw(4),
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: SIZES.fontSize.sm,
        color: COLORS.textSecondary,
        textDecorationLine: "underline",
    },
    actionButtons: {
        flexDirection: "row",
        gap: rw(3),
        width: "100%",
    },
    cancelButton: {
        flex: 1,
        paddingVertical: rh(1.5),
        paddingHorizontal: rw(4),
        borderRadius: SIZES.borderRadius.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButtonText: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.textSecondary,
        fontWeight: "500",
    },
    confirmButton: {
        flex: 1,
    },
});

export default ConfirmModal;
