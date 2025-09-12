import { useModal as useModalContext } from "../contexts/ModalContext";

// Переэкспортируем хук для удобства
export { useModalContext as useModal };

// Дополнительные утилиты для работы с модалками
export const useModalUtils = () => {
    const modal = useModalContext();

    const showNetworkError = () => {
        modal.showError(
            "Проблема с подключением к интернету. Проверьте соединение и попробуйте снова.",
            {
                title: "Ошибка сети",
                buttonText: "Понятно",
            }
        );
    };

    const showServerError = () => {
        modal.showError(
            "Произошла ошибка на сервере. Попробуйте позже или обратитесь в поддержку.",
            {
                title: "Ошибка сервера",
                buttonText: "Понятно",
            }
        );
    };

    const showValidationError = (message: string) => {
        modal.showError(message, {
            title: "Ошибка валидации",
            buttonText: "Исправить",
        });
    };

    const showSuccessMessage = (message: string, autoClose = true) => {
        modal.showSuccess(message, {
            autoClose,
            autoCloseDelay: autoClose ? 3000 : undefined,
        });
    };

    const showInfoMessage = (message: string, autoClose = false) => {
        modal.showInfo(message, {
            autoClose,
            autoCloseDelay: autoClose ? 5000 : undefined,
        });
    };

    const showConfirmDialog = (
        message: string,
        onConfirm: () => void,
        options?: {
            title?: string;
            confirmText?: string;
            cancelText?: string;
            type?: "warning" | "danger" | "info";
        }
    ) => {
        modal.showConfirm(message, onConfirm, options);
    };

    return {
        ...modal,
        showNetworkError,
        showServerError,
        showValidationError,
        showSuccessMessage,
        showInfoMessage,
        showConfirmDialog,
    };
};
