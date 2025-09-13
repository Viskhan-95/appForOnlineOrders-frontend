import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../utils/constants/colors";
import { GRADIENT_COLORS } from "../../utils/constants/gradients";
import { scaleSize, verticalScale } from "../../utils/responsive";
import metricsService from "../../services/metricsService";
import { ErrorDetails } from "../../services/errorService";

interface RouteErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
    errorId?: string;
    routeName?: string;
}

interface RouteErrorBoundaryProps {
    children: ReactNode;
    routeName?: string;
    onError?: (error: Error, errorInfo: ErrorInfo, routeName?: string) => void;
    onNavigateHome?: () => void;
    onNavigateBack?: () => void;
    fallback?: ReactNode;
}

class RouteErrorBoundary extends Component<
    RouteErrorBoundaryProps,
    RouteErrorBoundaryState
> {
    constructor(props: RouteErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            routeName: props.routeName,
        };
    }

    static getDerivedStateFromError(
        error: Error
    ): Partial<RouteErrorBoundaryState> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const { onError, routeName } = this.props;

        this.setState({
            error,
            errorInfo,
            routeName: routeName || this.state.routeName,
        });

        // Записываем ошибку в метрики
        this.recordError(error, errorInfo);

        // Вызываем пользовательский обработчик
        if (onError) {
            onError(error, errorInfo, routeName || this.state.routeName);
        }

        // Логируем ошибку для разработки
        if (__DEV__) {
            console.group(
                `🚨 Route Error Boundary - ${routeName || "Unknown Route"}`
            );
            console.error("Error:", error);
            console.error("Error Info:", errorInfo);
            console.error("Route:", routeName);
            console.groupEnd();
        }
    }

    private async recordError(error: Error, errorInfo: ErrorInfo) {
        try {
            const errorDetails: ErrorDetails = {
                message: error.message,
                code: this.getErrorCode(error),
            };

            const errorId = await metricsService.recordError(
                errorDetails,
                `Route: ${this.state.routeName || "Unknown"}`,
                undefined,
                0
            );

            this.setState({ errorId });
        } catch (metricsError) {
            console.warn(
                "Failed to record route error in metrics:",
                metricsError
            );
        }
    }

    private getErrorCode(error: Error): string {
        if (error.name === "NavigationError") {
            return "NAVIGATION_ERROR";
        }

        if (error.message.includes("Route")) {
            return "ROUTE_ERROR";
        }

        return "COMPONENT_ERROR";
    }

    private handleNavigateHome = () => {
        const { onNavigateHome } = this.props;

        if (onNavigateHome) {
            onNavigateHome();
        }

        this.handleReset();
    };

    private handleNavigateBack = () => {
        const { onNavigateBack } = this.props;

        if (onNavigateBack) {
            onNavigateBack();
        }

        this.handleReset();
    };

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined,
            errorId: undefined,
        });
    };

    private handleReport = async () => {
        const { error, errorId, routeName } = this.state;

        if (error && errorId) {
            try {
                console.log("Reporting route error:", {
                    error,
                    errorId,
                    route: routeName,
                });

                await metricsService.resolveError(errorId);
            } catch (reportError) {
                console.warn("Failed to report route error:", reportError);
            }
        }
    };

    render() {
        const { hasError, error, routeName } = this.state;
        const { children, fallback } = this.props;

        if (hasError && error) {
            if (fallback) {
                return fallback;
            }

            return (
                <View style={styles.container}>
                    <LinearGradient
                        colors={GRADIENT_COLORS.error}
                        style={styles.headerGradient}
                    >
                        <View style={styles.iconContainer}>
                            <Text style={styles.iconText}>🚫</Text>
                        </View>
                    </LinearGradient>

                    <View style={styles.content}>
                        <Text style={styles.title}>Ошибка загрузки экрана</Text>

                        {routeName && (
                            <Text style={styles.routeName}>
                                Экран: {routeName}
                            </Text>
                        )}

                        <Text style={styles.message}>
                            Произошла ошибка при загрузке экрана. Попробуйте
                            вернуться назад или перейти на главную страницу.
                        </Text>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={this.handleNavigateBack}
                            >
                                <Text style={styles.primaryButtonText}>
                                    Назад
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={this.handleNavigateHome}
                            >
                                <Text style={styles.secondaryButtonText}>
                                    На главную
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.reportButton}
                            onPress={this.handleReport}
                        >
                            <Text style={styles.reportButtonText}>
                                Сообщить об ошибке
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: scaleSize(20),
        justifyContent: "center",
    },
    headerGradient: {
        height: verticalScale(100),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: verticalScale(30),
        borderRadius: scaleSize(16),
    },
    iconContainer: {
        width: scaleSize(60),
        height: scaleSize(60),
        borderRadius: scaleSize(30),
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    iconText: {
        fontSize: scaleSize(30),
    },
    content: {
        alignItems: "center",
    },
    title: {
        fontSize: scaleSize(22),
        fontWeight: "bold",
        color: COLORS.text,
        textAlign: "center",
        marginBottom: verticalScale(8),
    },
    routeName: {
        fontSize: scaleSize(16),
        color: COLORS.primary,
        textAlign: "center",
        marginBottom: verticalScale(16),
        fontWeight: "500",
    },
    message: {
        fontSize: scaleSize(16),
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: scaleSize(24),
        marginBottom: verticalScale(32),
    },
    actionsContainer: {
        width: "100%",
        gap: verticalScale(12),
        marginBottom: verticalScale(24),
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: scaleSize(12),
        paddingVertical: verticalScale(16),
        paddingHorizontal: scaleSize(24),
        alignItems: "center",
    },
    primaryButtonText: {
        fontSize: scaleSize(16),
        fontWeight: "600",
        color: COLORS.background,
    },
    secondaryButton: {
        backgroundColor: COLORS.surface,
        borderRadius: scaleSize(12),
        paddingVertical: verticalScale(16),
        paddingHorizontal: scaleSize(24),
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    secondaryButtonText: {
        fontSize: scaleSize(16),
        fontWeight: "600",
        color: COLORS.text,
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
});

export default RouteErrorBoundary;
