import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../ui/Button";
import { COLORS } from "../../utils/constants/colors";
import { GRADIENT_COLORS } from "../../utils/constants/gradients";
import { scaleSize, verticalScale } from "../../utils/responsive";

interface NetworkErrorFallbackProps {
    onRetry: () => void;
    onGoBack?: () => void;
    retryCount?: number;
    maxRetries?: number;
    context?: string;
}

const NetworkErrorFallback: React.FC<NetworkErrorFallbackProps> = ({
    onRetry,
    onGoBack,
    retryCount = 0,
    maxRetries = 3,
    context,
}) => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        if (isRetrying || retryCount >= maxRetries) return;

        setIsRetrying(true);
        try {
            await onRetry();
        } finally {
            setIsRetrying(false);
        }
    };

    const canRetry = retryCount < maxRetries && !isRetrying;
    const retryText =
        retryCount > 0
            ? `Попытка ${retryCount + 1} из ${maxRetries}`
            : "Попробовать снова";

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={GRADIENT_COLORS.warning}
                style={styles.headerGradient}
            >
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>📡</Text>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.title}>Проблема с подключением</Text>

                <Text style={styles.message}>
                    Не удается подключиться к серверу. Проверьте подключение к
                    интернету и попробуйте снова.
                    {context && `\n\nКонтекст: ${context}`}
                </Text>

                {retryCount > 0 && (
                    <View style={styles.retryInfo}>
                        <Text style={styles.retryInfoText}>{retryText}</Text>
                        {retryCount >= maxRetries && (
                            <Text style={styles.maxRetriesText}>
                                Достигнуто максимальное количество попыток
                            </Text>
                        )}
                    </View>
                )}

                <View style={styles.actionsContainer}>
                    {canRetry ? (
                        <Button
                            gradientColors={GRADIENT_COLORS.primary}
                            textColor={COLORS.background}
                            onPress={handleRetry}
                            style={styles.actionButton}
                            disabled={isRetrying}
                        >
                            <View style={styles.buttonContent}>
                                {isRetrying && (
                                    <ActivityIndicator
                                        size="small"
                                        color={COLORS.background}
                                        style={styles.loader}
                                    />
                                )}
                                <Text style={styles.buttonText}>
                                    {isRetrying
                                        ? "Подключение..."
                                        : "Попробовать снова"}
                                </Text>
                            </View>
                        </Button>
                    ) : (
                        <View style={styles.noRetryContainer}>
                            <Text style={styles.noRetryText}>
                                Невозможно подключиться к серверу
                            </Text>
                        </View>
                    )}

                    {onGoBack && (
                        <Button
                            gradientColors={GRADIENT_COLORS.secondary}
                            textColor={COLORS.background}
                            onPress={onGoBack}
                            style={styles.actionButton}
                        >
                            <Text style={styles.buttonText}>Назад</Text>
                        </Button>
                    )}

                    <TouchableOpacity
                        style={styles.helpButton}
                        onPress={() => {
                            // Здесь можно открыть экран помощи или настройки
                        }}
                    >
                        <Text style={styles.helpButtonText}>
                            Проверить настройки сети
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>Возможные решения:</Text>
                    <View style={styles.tipsList}>
                        <Text style={styles.tipItem}>
                            • Проверьте подключение к Wi-Fi или мобильному
                            интернету
                        </Text>
                        <Text style={styles.tipItem}>
                            • Перезапустите приложение
                        </Text>
                        <Text style={styles.tipItem}>
                            • Проверьте настройки брандмауэра
                        </Text>
                        <Text style={styles.tipItem}>
                            • Попробуйте через другую сеть
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: scaleSize(20),
        justifyContent: "center",
    },
    headerGradient: {
        height: verticalScale(120),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: verticalScale(30),
        borderRadius: scaleSize(16),
    },
    iconContainer: {
        width: scaleSize(80),
        height: scaleSize(80),
        borderRadius: scaleSize(40),
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    iconText: {
        fontSize: scaleSize(40),
    },
    content: {
        alignItems: "center",
    },
    title: {
        fontSize: scaleSize(24),
        fontWeight: "bold",
        color: COLORS.text,
        textAlign: "center",
        marginBottom: verticalScale(16),
    },
    message: {
        fontSize: scaleSize(16),
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: scaleSize(24),
        marginBottom: verticalScale(24),
    },
    retryInfo: {
        backgroundColor: COLORS.surface,
        borderRadius: scaleSize(12),
        padding: scaleSize(16),
        marginBottom: verticalScale(24),
        width: "100%",
    },
    retryInfoText: {
        fontSize: scaleSize(14),
        color: COLORS.text,
        textAlign: "center",
        fontWeight: "500",
    },
    maxRetriesText: {
        fontSize: scaleSize(12),
        color: COLORS.error,
        textAlign: "center",
        marginTop: verticalScale(4),
    },
    actionsContainer: {
        width: "100%",
        gap: verticalScale(12),
        marginBottom: verticalScale(32),
    },
    actionButton: {
        width: "100%",
        height: verticalScale(50),
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    loader: {
        marginRight: scaleSize(8),
    },
    buttonText: {
        fontSize: scaleSize(16),
        fontWeight: "600",
        color: COLORS.background,
    },
    noRetryContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: scaleSize(12),
        padding: scaleSize(20),
        alignItems: "center",
    },
    noRetryText: {
        fontSize: scaleSize(16),
        color: COLORS.error,
        textAlign: "center",
        fontWeight: "500",
    },
    helpButton: {
        paddingVertical: verticalScale(12),
        alignItems: "center",
    },
    helpButtonText: {
        fontSize: scaleSize(14),
        color: COLORS.primary,
        textDecorationLine: "underline",
    },
    tipsContainer: {
        width: "100%",
        backgroundColor: COLORS.surface,
        borderRadius: scaleSize(12),
        padding: scaleSize(16),
    },
    tipsTitle: {
        fontSize: scaleSize(16),
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: verticalScale(12),
    },
    tipsList: {
        gap: verticalScale(8),
    },
    tipItem: {
        fontSize: scaleSize(14),
        color: COLORS.textSecondary,
        lineHeight: scaleSize(20),
    },
});

export default NetworkErrorFallback;
