import { useCallback } from "react";
import { useModal } from "./useModal";
import BackendErrorService from "../services/backendErrorService";

export const useBackendErrorHandler = () => {
    const modal = useModal();

    const handleRegistrationError = useCallback(
        (error: any) => {
            return BackendErrorService.handleRegistrationError(
                {
                    message: error.message || error.response?.data?.message,
                    code: error.code || error.response?.data?.code,
                    statusCode: error.statusCode || error.response?.status,
                    field: error.field || error.response?.data?.field,
                },
                modal
            );
        },
        [modal]
    );

    const handleLoginError = useCallback(
        (error: any) => {
            return BackendErrorService.handleLoginError(
                {
                    message: error.message || error.response?.data?.message,
                    code: error.code || error.response?.data?.code,
                    statusCode: error.statusCode || error.response?.status,
                    field: error.field || error.response?.data?.field,
                },
                modal
            );
        },
        [modal]
    );

    const handlePasswordResetError = useCallback(
        (error: any) => {
            return BackendErrorService.handlePasswordResetError(
                {
                    message: error.message || error.response?.data?.message,
                    code: error.code || error.response?.data?.code,
                    statusCode: error.statusCode || error.response?.status,
                    field: error.field || error.response?.data?.field,
                },
                modal
            );
        },
        [modal]
    );

    const handleBackendError = useCallback(
        (
            error: any,
            context: "registration" | "login" | "passwordReset" | "general"
        ) => {
            return BackendErrorService.handleBackendError(
                error,
                context,
                modal
            );
        },
        [modal]
    );

    return {
        handleRegistrationError,
        handleLoginError,
        handlePasswordResetError,
        handleBackendError,
    };
};

export default useBackendErrorHandler;
