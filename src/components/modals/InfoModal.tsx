import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BaseModal from "./BaseModal";
import Button from "../ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";
import { SIZES } from "../../utils/constans/sizes";
import { rw, rh } from "../../utils/responsive";

interface InfoModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    buttonText?: string;
    onButtonPress?: () => void;
    showCloseButton?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

const InfoModal: React.FC<InfoModalProps> = ({
    visible,
    onClose,
    title = "Информация",
    message,
    buttonText = "Понятно",
    onButtonPress,
    showCloseButton = true,
    autoClose = false,
    autoCloseDelay = 5000,
}) => {
    const handleButtonPress = () => {
        if (onButtonPress) {
            onButtonPress();
        }
        onClose();
    };

    // Автоматическое закрытие
    React.useEffect(() => {
        if (visible && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [visible, autoClose, autoCloseDelay, onClose]);

    return (
        <BaseModal visible={visible} onClose={onClose}>
            <View style={styles.container}>
                {/* Иконка информации */}
                <View style={styles.iconContainer}>
                    <LinearGradient
                        colors={GRADIENT_COLORS.primary}
                        style={styles.iconGradient}
                    >
                        <Text style={styles.iconText}>i</Text>
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
                        gradientColors={GRADIENT_COLORS.primary}
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

export default InfoModal;
