import { ErrorDetails } from "./errorService";
import { useModal } from "../hooks/useModal";

export interface BackendErrorResponse {
    message: string;
    code?: string;
    statusCode?: number;
    field?: string;
    details?: any;
}

export class BackendErrorService {
    /**
     * Обработка ошибок регистрации
     */
    static handleRegistrationError(
        error: BackendErrorResponse,
        modal: ReturnType<typeof useModal>
    ) {
        const { message, code, statusCode } = error;

        // Email уже существует
        if (
            statusCode === 409 ||
            code === "EMAIL_EXISTS" ||
            message.includes("уже существует") ||
            message.includes("already exists")
        ) {
            modal.showError(
                "Пользователь с таким email уже зарегистрирован. Вы можете восстановить пароль, если забыли его.",
                {
                    title: "Email уже используется",
                    buttonText: "Восстановить пароль",
                    onButtonPress: () => {
                        modal.hide();
                        // Навигация будет добавлена через callback в компоненте
                    },
                }
            );
            return true;
        }

        // Ошибка валидации
        if (statusCode === 422 || code === "VALIDATION_ERROR") {
            modal.showError(message, {
                title: "Ошибка валидации",
                buttonText: "Исправить",
            });
            return true;
        }

        // Общая ошибка регистрации
        modal.showError(
            message || "Произошла ошибка при регистрации. Попробуйте еще раз.",
            {
                title: "Ошибка регистрации",
                buttonText: "Понятно",
            }
        );
        return true;
    }

    /**
     * Обработка ошибок авторизации
     */
    static handleLoginError(
        error: BackendErrorResponse,
        modal: ReturnType<typeof useModal>
    ) {
        const { message, code, statusCode } = error;

        // Неверные учетные данные
        if (
            statusCode === 401 ||
            code === "INVALID_CREDENTIALS" ||
            message.includes("неверные") ||
            message.includes("invalid") ||
            message.includes("неправильный") ||
            message.includes("incorrect")
        ) {
            modal.showError(
                "Введенные данные неверны. Проверьте email и пароль, затем попробуйте снова.",
                {
                    title: "Ошибка входа",
                    buttonText: "Понятно",
                }
            );
            return true;
        }

        // Аккаунт заблокирован
        if (statusCode === 423 || code === "ACCOUNT_LOCKED") {
            modal.showError(
                "Ваш аккаунт временно заблокирован. Обратитесь в поддержку.",
                {
                    title: "Аккаунт заблокирован",
                    buttonText: "Понятно",
                }
            );
            return true;
        }

        // Требуется подтверждение email
        if (statusCode === 403 || code === "EMAIL_NOT_VERIFIED") {
            modal.showError(
                "Для входа необходимо подтвердить email. Проверьте почту и перейдите по ссылке из письма.",
                {
                    title: "Подтвердите email",
                    buttonText: "Понятно",
                }
            );
            return true;
        }

        // Общая ошибка авторизации
        modal.showError(
            message || "Произошла ошибка при входе. Попробуйте еще раз.",
            {
                title: "Ошибка входа",
                buttonText: "Понятно",
            }
        );
        return true;
    }

    /**
     * Обработка ошибок восстановления пароля
     */
    static handlePasswordResetError(
        error: BackendErrorResponse,
        modal: ReturnType<typeof useModal>
    ) {
        const { message, code, statusCode } = error;

        // Email не найден
        if (
            statusCode === 404 ||
            code === "USER_NOT_FOUND" ||
            message.includes("не найден")
        ) {
            modal.showError(
                "Пользователь с таким email не найден. Проверьте правильность написания email.",
                {
                    title: "Пользователь не найден",
                    buttonText: "Понятно",
                }
            );
            return true;
        }

        // Слишком много попыток
        if (statusCode === 429 || code === "RATE_LIMITED") {
            modal.showError(
                "Слишком много попыток восстановления пароля. Подождите немного и попробуйте снова.",
                {
                    title: "Превышен лимит",
                    buttonText: "Понятно",
                }
            );
            return true;
        }

        // Общая ошибка восстановления
        modal.showError(
            message ||
                "Произошла ошибка при восстановлении пароля. Попробуйте еще раз.",
            {
                title: "Ошибка восстановления",
                buttonText: "Понятно",
            }
        );
        return true;
    }

    /**
     * Универсальная обработка ошибок backend
     */
    static handleBackendError(
        error: any,
        context: "registration" | "login" | "passwordReset" | "general",
        modal: ReturnType<typeof useModal>
    ) {
        // Преобразуем ошибку в BackendErrorResponse
        const backendError: BackendErrorResponse = {
            message:
                error.message ||
                error.response?.data?.message ||
                "Неизвестная ошибка",
            code: error.code || error.response?.data?.code,
            statusCode: error.statusCode || error.response?.status,
            field: error.field || error.response?.data?.field,
            details: error.details || error.response?.data?.details,
        };

        // Логируем для разработки
        if (__DEV__) {
            console.group(`🚨 Backend Error - ${context}`);
            console.error("Original error:", error);
            console.error("Processed error:", backendError);
            console.groupEnd();
        }

        // Обрабатываем в зависимости от контекста
        switch (context) {
            case "registration":
                return this.handleRegistrationError(backendError, modal);
            case "login":
                return this.handleLoginError(backendError, modal);
            case "passwordReset":
                return this.handlePasswordResetError(backendError, modal);
            default:
                modal.showError(backendError.message, {
                    title: "Ошибка",
                    buttonText: "Понятно",
                });
                return true;
        }
    }

    /**
     * Проверить, является ли ошибка ошибкой backend
     */
    static isBackendError(error: any): boolean {
        return (
            error &&
            (error.response ||
                error.statusCode ||
                error.code ||
                (error.message && typeof error.message === "string"))
        );
    }
}

export default BackendErrorService;
