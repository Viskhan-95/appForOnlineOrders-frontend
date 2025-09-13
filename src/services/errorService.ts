import metricsService from "./metricsService";

export interface ErrorDetails {
    message: string;
    code?: string;
    statusCode?: number;
    field?: string;
}

export class ErrorService {
    /**
     * Обработка ошибок API
     */
    static handleApiError(error: any): ErrorDetails {
        // Axios ошибки
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    return {
                        message: data?.message || "Некорректные данные",
                        statusCode: status,
                        code: data?.code,
                        field: data?.field,
                    };

                case 401:
                    return {
                        message: "Необходима авторизация",
                        statusCode: status,
                        code: "UNAUTHORIZED",
                    };

                case 403:
                    return {
                        message: "Доступ запрещен",
                        statusCode: status,
                        code: "FORBIDDEN",
                    };

                case 404:
                    return {
                        message: "Ресурс не найден",
                        statusCode: status,
                        code: "NOT_FOUND",
                    };

                case 422:
                    return {
                        message: data?.message || "Ошибка валидации",
                        statusCode: status,
                        code: "VALIDATION_ERROR",
                        field: data?.field,
                    };

                case 429:
                    return {
                        message: "Слишком много запросов. Попробуйте позже",
                        statusCode: status,
                        code: "RATE_LIMITED",
                    };

                case 500:
                    return {
                        message: "Внутренняя ошибка сервера",
                        statusCode: status,
                        code: "INTERNAL_ERROR",
                    };

                default:
                    return {
                        message: data?.message || "Произошла ошибка",
                        statusCode: status,
                        code: data?.code,
                    };
            }
        }

        // Ошибки сети
        if (error.request) {
            return {
                message: "Проблема с подключением к серверу",
                code: "NETWORK_ERROR",
            };
        }

        // Другие ошибки
        return {
            message: error.message || "Неизвестная ошибка",
            code: "UNKNOWN_ERROR",
        };
    }

    /**
     * Получение пользовательского сообщения об ошибке
     */
    static getUserFriendlyMessage(error: ErrorDetails): string {
        const { message, code } = error;

        // Специальные случаи для известных ошибок
        switch (code) {
            case "NETWORK_ERROR":
                return "Проблема с подключением к интернету. Проверьте соединение и попробуйте снова.";

            case "RATE_LIMITED":
                return "Слишком много попыток. Подождите немного и попробуйте снова.";

            case "VALIDATION_ERROR":
                return message;

            case "UNAUTHORIZED":
                return "Сессия истекла. Войдите в систему заново.";

            case "FORBIDDEN":
                return "У вас нет прав для выполнения этого действия.";

            default:
                return message;
        }
    }

    /**
     * Логирование ошибок для разработки
     */
    static logError(error: any, context?: string): void {
        if (__DEV__) {
            console.group(`🚨 Error${context ? ` in ${context}` : ""}`);
            console.error("Original error:", error);
            console.error("Processed error:", this.handleApiError(error));
            console.groupEnd();
        }
    }

    /**
     * Записать ошибку в метрики
     */
    static async recordError(
        error: any,
        context?: string,
        userId?: string,
        retryCount: number = 0
    ): Promise<string> {
        const errorDetails = this.handleApiError(error);
        return await metricsService.recordError(
            errorDetails,
            context,
            userId,
            retryCount
        );
    }

    /**
     * Проверка, является ли ошибка ошибкой валидации
     */
    static isValidationError(error: ErrorDetails): boolean {
        return error.code === "VALIDATION_ERROR" || error.statusCode === 422;
    }

    /**
     * Проверка, является ли ошибка сетевой
     */
    static isNetworkError(error: ErrorDetails): boolean {
        return error.code === "NETWORK_ERROR";
    }

    /**
     * Проверка, требует ли ошибка повторного входа
     */
    static requiresReauth(error: ErrorDetails): boolean {
        return error.statusCode === 401 || error.code === "UNAUTHORIZED";
    }
}

export default ErrorService;
