import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../utils/constants/colors";
import { SIZES } from "../../utils/constants/sizes";
import { rw, rh } from "../../utils/responsive";
import useBackendErrorHandler from "../../hooks/useBackendErrorHandler";

/**
 * Тестовый компонент для демонстрации обработки ошибок от backend
 * Используется только в development режиме
 */
const ErrorTestComponent: React.FC = () => {
    const {
        handleRegistrationError,
        handleLoginError,
        handlePasswordResetError,
    } = useBackendErrorHandler();

    if (!__DEV__) {
        return null;
    }

    const testRegistrationError = () => {
        // Симулируем ошибку "Email уже существует"
        const mockError = {
            response: {
                status: 409,
                data: {
                    message: "Пользователь с таким email уже существует",
                    code: "EMAIL_EXISTS",
                },
            },
        };
        handleRegistrationError(mockError);
    };

    const testLoginError = () => {
        // Симулируем ошибку "Неверные учетные данные"
        const mockError = {
            response: {
                status: 401,
                data: {
                    message: "Неверные учетные данные",
                    code: "INVALID_CREDENTIALS",
                },
            },
        };
        handleLoginError(mockError);
    };

    const testPasswordResetError = () => {
        // Симулируем ошибку "Пользователь не найден"
        const mockError = {
            response: {
                status: 404,
                data: {
                    message: "Пользователь не найден",
                    code: "USER_NOT_FOUND",
                },
            },
        };
        handlePasswordResetError(mockError);
    };

    const testValidationError = () => {
        // Симулируем ошибку валидации
        const mockError = {
            response: {
                status: 422,
                data: {
                    message: "Пароль должен содержать минимум 6 символов",
                    code: "VALIDATION_ERROR",
                    field: "password",
                },
            },
        };
        handleRegistrationError(mockError);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🧪 Тест ошибок Backend</Text>
            <Text style={styles.subtitle}>Только для разработки (__DEV__)</Text>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={testRegistrationError}
                >
                    <Text style={styles.buttonText}>
                        Тест: Email уже существует
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={testLoginError}
                >
                    <Text style={styles.buttonText}>
                        Тест: Неверные данные входа
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={testPasswordResetError}
                >
                    <Text style={styles.buttonText}>
                        Тест: Пользователь не найден
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={testValidationError}
                >
                    <Text style={styles.buttonText}>
                        Тест: Ошибка валидации
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.borderRadius.medium,
        padding: SIZES.padding.md,
        margin: SIZES.margin.md,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    title: {
        fontSize: SIZES.fontSize.lg,
        fontWeight: "bold",
        color: COLORS.text,
        textAlign: "center",
        marginBottom: SIZES.margin.sm,
    },
    subtitle: {
        fontSize: SIZES.fontSize.xs,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: SIZES.margin.md,
        fontStyle: "italic",
    },
    buttonsContainer: {
        gap: SIZES.margin.sm,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.borderRadius.medium,
        paddingVertical: SIZES.padding.sm,
        paddingHorizontal: SIZES.padding.md,
        alignItems: "center",
    },
    buttonText: {
        fontSize: SIZES.fontSize.sm,
        fontWeight: "600",
        color: COLORS.background,
    },
});

export default ErrorTestComponent;
