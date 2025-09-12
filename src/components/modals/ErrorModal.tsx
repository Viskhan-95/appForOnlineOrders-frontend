import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BaseModal from "./BaseModal";
import Button from "../ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";
import { SIZES } from "../../utils/constans/sizes";
import { rw, rh } from "../../utils/responsive";

interface ErrorModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    buttonText?: string;
    onButtonPress?: () => void;
    showCloseButton?: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
    visible,
    onClose,
    title = "Ошибка",
    message,
    buttonText = "Понятно",
    onButtonPress,
    showCloseButton = true,
}) => {
    const handleButtonPress = () => {
        if (onButtonPress) {
            onButtonPress();
        }
        onClose();
    };

    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={styles.container}>
                {/* Иконка ошибки */}
                <View style={styles.iconContainer}>
                    <LinearGradient
                        colors={GRADIENT_COLORS.error}
                        style={styles.iconGradient}
                    >
                        <Text style={styles.iconText}>!</Text>
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

                    <Button
                        gradientColors={GRADIENT_COLORS.error}
                        textColor={COLORS.background}
                        onPress={handleButtonPress}
                        style={styles.primaryButton}
                    >
                        <Text>{buttonText}</Text>
                    </Button>
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
    primaryButton: {
        width: "100%",
    },
});

export default ErrorModal;
