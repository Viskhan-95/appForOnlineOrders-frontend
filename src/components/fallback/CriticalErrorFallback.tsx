import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../ui/Button";
import { COLORS } from "../../utils/constants/colors";
import { GRADIENT_COLORS } from "../../utils/constants/gradients";
import { scaleSize, verticalScale } from "../../utils/responsive";

interface CriticalErrorFallbackProps {
    error: Error;
    resetError: () => void;
    context?: string;
    showDetails?: boolean;
    onRetry?: () => void;
    onReport?: () => void;
}

const CriticalErrorFallback: React.FC<CriticalErrorFallbackProps> = ({
    error,
    resetError,
    context,
    showDetails = __DEV__,
    onRetry,
    onReport,
}) => {
    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
        resetError();
    };

    const handleReport = () => {
        if (onReport) {
            onReport();
        }
    };

    const handleRestart = () => {
        // В React Native нет прямого способа перезапустить приложение
        // Обычно это делается через навигацию к корневому экрану
        resetError();
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <LinearGradient
                colors={GRADIENT_COLORS.error}
                style={styles.headerGradient}
            >
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>⚠️</Text>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.title}>Критическая ошибка</Text>

                <Text style={styles.message}>
                    Произошла серьезная ошибка, которая может повлиять на работу
                    приложения.
                    {context && ` Контекст: ${context}`}
                </Text>

                {showDetails && (
                    <View style={styles.errorDetails}>
                        <Text style={styles.errorDetailsTitle}>
                            Детали ошибки:
                        </Text>
                        <Text style={styles.errorDetailsText}>
                            {error.message}
                        </Text>
                        {error.stack && (
                            <Text style={styles.errorStack}>{error.stack}</Text>
                        )}
                    </View>
                )}

                <View style={styles.actionsContainer}>
                    {onRetry && (
                        <Button
                            gradientColors={GRADIENT_COLORS.primary}
                            textColor={COLORS.background}
                            onPress={handleRetry}
                            style={styles.actionButton}
                        >
                            <Text style={styles.buttonText}>
                                Попробовать снова
                            </Text>
                        </Button>
                    )}

                    <Button
                        gradientColors={GRADIENT_COLORS.secondary}
                        textColor={COLORS.background}
                        onPress={handleRestart}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>Перезапустить</Text>
                    </Button>

                    {onReport && (
                        <TouchableOpacity
                            style={styles.reportButton}
                            onPress={handleReport}
                        >
                            <Text style={styles.reportButtonText}>
                                Сообщить об ошибке
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Если проблема повторяется, обратитесь в поддержку
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: scaleSize(20),
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
    errorDetails: {
        width: "100%",
        backgroundColor: COLORS.surface,
        borderRadius: scaleSize(12),
        padding: scaleSize(16),
        marginBottom: verticalScale(24),
    },
    errorDetailsTitle: {
        fontSize: scaleSize(16),
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: verticalScale(8),
    },
    errorDetailsText: {
        fontSize: scaleSize(14),
        color: COLORS.error,
        fontFamily: "monospace",
        marginBottom: verticalScale(8),
    },
    errorStack: {
        fontSize: scaleSize(12),
        color: COLORS.textSecondary,
        fontFamily: "monospace",
        lineHeight: scaleSize(16),
    },
    actionsContainer: {
        width: "100%",
        gap: verticalScale(12),
    },
    actionButton: {
        width: "100%",
        height: verticalScale(50),
    },
    buttonText: {
        fontSize: scaleSize(16),
        fontWeight: "600",
        color: COLORS.background,
    },
    reportButton: {
        paddingVertical: verticalScale(12),
        alignItems: "center",
    },
    reportButtonText: {
        fontSize: scaleSize(14),
        color: COLORS.primary,
        textDecorationLine: "underline",
    },
    footer: {
        marginTop: verticalScale(32),
        paddingHorizontal: scaleSize(20),
    },
    footerText: {
        fontSize: scaleSize(12),
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: scaleSize(18),
    },
});

export default CriticalErrorFallback;
