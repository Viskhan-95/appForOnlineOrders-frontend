import React, { Component, ErrorInfo, ReactNode } from "react";
import CriticalErrorFallback from "../fallback/CriticalErrorFallback";
import NetworkErrorFallback from "../fallback/NetworkErrorFallback";
import metricsService from "../../services/metricsService";
import { ErrorDetails } from "../../services/errorService";

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
    errorId?: string;
    retryCount: number;
    isNetworkError: boolean;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
    onRetry?: () => void;
    context?: string;
    maxRetries?: number;
    enableMetrics?: boolean;
    enableRetry?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private retryTimeout?: NodeJS.Timeout;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            retryCount: 0,
            isNetworkError: false,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Обновляем состояние для отображения fallback UI
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const { onError, context, enableMetrics = true } = this.props;

        // Определяем тип ошибки
        const isNetworkError = this.isNetworkError(error);

        this.setState({
            error,
            errorInfo,
            isNetworkError,
        });

        // Записываем ошибку в метрики
        if (enableMetrics) {
            this.recordError(error, errorInfo, context);
        }

        // Вызываем пользовательский обработчик
        if (onError) {
            onError(error, errorInfo, this.state.errorId || "");
        }

        // Логируем ошибку для разработки
        if (__DEV__) {
            console.group("🚨 Error Boundary Caught Error");
            console.error("Error:", error);
            console.error("Error Info:", errorInfo);
            console.error("Component Stack:", errorInfo.componentStack);
            console.groupEnd();
        }
    }

    private async recordError(
        error: Error,
        errorInfo: ErrorInfo,
        context?: string
    ) {
        try {
            const errorDetails: ErrorDetails = {
                message: error.message,
                code: this.getErrorCode(error),
            };

            const errorId = await metricsService.recordError(
                errorDetails,
                `ErrorBoundary: ${context || "Unknown"}`,
                undefined,
                this.state.retryCount
            );

            this.setState({ errorId });
        } catch (metricsError) {
            console.warn("Failed to record error in metrics:", metricsError);
        }
    }

    private isNetworkError(error: Error): boolean {
        const networkErrorMessages = [
            "Network request failed",
            "Network Error",
            "Connection timeout",
            "No internet connection",
            "Failed to fetch",
        ];

        return networkErrorMessages.some((msg) =>
            error.message.toLowerCase().includes(msg.toLowerCase())
        );
    }

    private getErrorCode(error: Error): string {
        if (this.isNetworkError(error)) {
            return "NETWORK_ERROR";
        }

        if (error.name === "ChunkLoadError") {
            return "CHUNK_LOAD_ERROR";
        }

        if (error.name === "TypeError") {
            return "TYPE_ERROR";
        }

        if (error.name === "ReferenceError") {
            return "REFERENCE_ERROR";
        }

        return "RUNTIME_ERROR";
    }

    private handleRetry = async () => {
        const { onRetry, maxRetries = 3, enableRetry = true } = this.props;
        const { retryCount } = this.state;

        if (!enableRetry || retryCount >= maxRetries) {
            return;
        }

        // Вызываем пользовательский обработчик retry
        if (onRetry) {
            try {
                await onRetry();
            } catch (retryError) {
                console.warn("Retry failed:", retryError);
            }
        }

        // Обновляем состояние
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined,
            retryCount: retryCount + 1,
        });
    };

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined,
            errorId: undefined,
            retryCount: 0,
            isNetworkError: false,
        });
    };

    private handleReport = async () => {
        const { error, errorId } = this.state;

        if (error && errorId) {
            try {
                // Здесь можно отправить отчет об ошибке на сервер
                console.log("Reporting error:", { error, errorId });

                // В реальном приложении здесь будет отправка на сервер
                // await reportErrorToServer({ error, errorId, context: this.props.context });

                // Отмечаем ошибку как решенную в метриках
                await metricsService.resolveError(errorId);
            } catch (reportError) {
                console.warn("Failed to report error:", reportError);
            }
        }
    };

    render() {
        const { hasError, error, errorInfo, retryCount, isNetworkError } =
            this.state;
        const {
            children,
            fallback,
            maxRetries = 3,
            enableRetry = true,
        } = this.props;

        if (hasError && error) {
            // Если предоставлен кастомный fallback
            if (fallback) {
                return fallback;
            }

            // Специальный fallback для сетевых ошибок
            if (isNetworkError && enableRetry) {
                return (
                    <NetworkErrorFallback
                        onRetry={this.handleRetry}
                        retryCount={retryCount}
                        maxRetries={maxRetries}
                        context={this.props.context}
                    />
                );
            }

            // Общий fallback для критических ошибок
            return (
                <CriticalErrorFallback
                    error={error}
                    resetError={this.handleReset}
                    context={this.props.context}
                    onRetry={enableRetry ? this.handleRetry : undefined}
                    onReport={this.handleReport}
                    showDetails={__DEV__}
                />
            );
        }

        return children;
    }

    componentWillUnmount() {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }
    }
}

export default ErrorBoundary;
