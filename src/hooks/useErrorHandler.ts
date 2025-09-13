import { useCallback } from "react";
import { useModal } from "./useModal";
import ErrorService, { ErrorDetails } from "../services/errorService";

export const useErrorHandler = () => {
    const modal = useModal();

    const handleError = useCallback(
        (error: any, context?: string) => {
            const errorDetails = ErrorService.handleApiError(error);
            const userMessage =
                ErrorService.getUserFriendlyMessage(errorDetails);

            // Логируем ошибку для разработки
            ErrorService.logError(error, context);

            // Показываем пользователю понятное сообщение
            modal.showError(userMessage);

            return errorDetails;
        },
        [modal]
    );

    const handleNetworkError = useCallback(() => {
        modal.showError(
            "Проблема с подключением к интернету. Проверьте соединение и попробуйте снова.",
            {
                title: "Ошибка сети",
                buttonText: "Понятно",
            }
        );
    }, [modal]);

    const handleValidationError = useCallback(
        (message: string) => {
            modal.showError(message, {
                title: "Ошибка валидации",
                buttonText: "Исправить",
            });
        },
        [modal]
    );

    const handleServerError = useCallback(() => {
        modal.showError(
            "Произошла ошибка на сервере. Попробуйте позже или обратитесь в поддержку.",
            {
                title: "Ошибка сервера",
                buttonText: "Понятно",
            }
        );
    }, [modal]);

    const handleAuthError = useCallback(() => {
        modal.showError("Сессия истекла. Войдите в систему заново.", {
            title: "Требуется авторизация",
            buttonText: "Войти",
        });
    }, [modal]);

    const handleRateLimitError = useCallback(() => {
        modal.showError(
            "Слишком много попыток. Подождите немного и попробуйте снова.",
            {
                title: "Превышен лимит запросов",
                buttonText: "Понятно",
            }
        );
    }, [modal]);

    // Специальные обработчики для разных типов ошибок
    const handleSpecificError = useCallback(
        (error: ErrorDetails) => {
            switch (error.code) {
                case "NETWORK_ERROR":
                    handleNetworkError();
                    break;
                case "VALIDATION_ERROR":
                    handleValidationError(error.message);
                    break;
                case "UNAUTHORIZED":
                    handleAuthError();
                    break;
                case "RATE_LIMITED":
                    handleRateLimitError();
                    break;
                default:
                    if (error.statusCode && error.statusCode >= 500) {
                        handleServerError();
                    } else {
                        modal.showError(error.message);
                    }
            }
        },
        [
            modal,
            handleNetworkError,
            handleValidationError,
            handleAuthError,
            handleRateLimitError,
            handleServerError,
        ]
    );

    return {
        handleError,
        handleNetworkError,
        handleValidationError,
        handleServerError,
        handleAuthError,
        handleRateLimitError,
        handleSpecificError,
    };
};

export default useErrorHandler;
