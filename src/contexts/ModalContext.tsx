import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import ErrorModal from "../components/modals/ErrorModal";
import SuccessModal from "../components/modals/SuccessModal";
import InfoModal from "../components/modals/InfoModal";
import ConfirmModal from "../components/modals/ConfirmModal";

export interface ModalState {
    type: "error" | "success" | "info" | "confirm" | null;
    visible: boolean;
    title?: string;
    message: string;
    buttonText?: string;
    confirmText?: string;
    cancelText?: string;
    onButtonPress?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCloseButton?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
    type?: "warning" | "danger" | "info";
}

interface ModalContextType {
    showError: (message: string, options?: Partial<ModalState>) => void;
    showSuccess: (message: string, options?: Partial<ModalState>) => void;
    showInfo: (message: string, options?: Partial<ModalState>) => void;
    showConfirm: (
        message: string,
        onConfirm: () => void,
        options?: Partial<ModalState>
    ) => void;
    hideModal: () => void;
    modalState: ModalState;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [modalState, setModalState] = useState<ModalState>({
        type: null,
        visible: false,
        message: "",
    });

    const showError = useCallback(
        (message: string, options: Partial<ModalState> = {}) => {
            setModalState({
                type: "error",
                visible: true,
                message,
                title: "Ошибка",
                buttonText: "Понятно",
                showCloseButton: true,
                ...options,
            });
        },
        []
    );

    const showSuccess = useCallback(
        (message: string, options: Partial<ModalState> = {}) => {
            setModalState({
                type: "success",
                visible: true,
                message,
                title: "Успешно!",
                buttonText: "Понятно",
                showCloseButton: false,
                autoClose: true,
                autoCloseDelay: 3000,
                ...options,
            });
        },
        []
    );

    const showInfo = useCallback(
        (message: string, options: Partial<ModalState> = {}) => {
            setModalState({
                type: "info",
                visible: true,
                message,
                title: "Информация",
                buttonText: "Понятно",
                showCloseButton: true,
                autoClose: false,
                ...options,
            });
        },
        []
    );

    const showConfirm = useCallback(
        (
            message: string,
            onConfirm: () => void,
            options: Partial<ModalState> = {}
        ) => {
            setModalState({
                type: "confirm",
                visible: true,
                message,
                title: "Подтверждение",
                confirmText: "Подтвердить",
                cancelText: "Отмена",
                onConfirm,
                showCloseButton: true,
                type: "warning",
                ...options,
            });
        },
        []
    );

    const hideModal = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            visible: false,
        }));
    }, []);

    const contextValue: ModalContextType = {
        showError,
        showSuccess,
        showInfo,
        showConfirm,
        hideModal,
        modalState,
    };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}

            {/* Рендерим модалки */}
            <ErrorModal
                visible={modalState.type === "error" && modalState.visible}
                onClose={hideModal}
                title={modalState.title}
                message={modalState.message}
                buttonText={modalState.buttonText}
                onButtonPress={modalState.onButtonPress}
                showCloseButton={modalState.showCloseButton}
            />

            <SuccessModal
                visible={modalState.type === "success" && modalState.visible}
                onClose={hideModal}
                title={modalState.title}
                message={modalState.message}
                buttonText={modalState.buttonText}
                onButtonPress={modalState.onButtonPress}
                showCloseButton={modalState.showCloseButton}
                autoClose={modalState.autoClose}
                autoCloseDelay={modalState.autoCloseDelay}
            />

            <InfoModal
                visible={modalState.type === "info" && modalState.visible}
                onClose={hideModal}
                title={modalState.title}
                message={modalState.message}
                buttonText={modalState.buttonText}
                onButtonPress={modalState.onButtonPress}
                showCloseButton={modalState.showCloseButton}
                autoClose={modalState.autoClose}
                autoCloseDelay={modalState.autoCloseDelay}
            />

            <ConfirmModal
                visible={modalState.type === "confirm" && modalState.visible}
                onClose={hideModal}
                title={modalState.title}
                message={modalState.message}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
                onConfirm={modalState.onConfirm || (() => {})}
                onCancel={modalState.onCancel}
                type={modalState.type as "warning" | "danger" | "info"}
                showCloseButton={modalState.showCloseButton}
            />
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
