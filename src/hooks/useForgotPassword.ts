import { useCallback, useState, useMemo } from "react";
import { useAuth } from "./useAuth";
import {
    forgotPasswordStep1,
    forgotPasswordStep2,
    forgotPasswordStep3,
    ForgotPasswordFormData,
} from "../validations";

interface ForgotPasswordState {
    email: string;
    code: string;
    password: string;
    isPasswordVisible: boolean;
    isSubmitting: boolean;
    autoSubmitTriggered: boolean;
    isCodeValid: boolean;
    isVerifyingCode: boolean;
    codeError: string;
}

export const useForgotPassword = () => {
    const {
        isLoading,
        forgotPassword,
        requestPasswordReset,
        verifyResetCode,
        confirmPasswordReset,
        setForgotPassword,
        resetForgotPassword,
    } = useAuth();

    const [state, setState] = useState<ForgotPasswordState>({
        email: "",
        code: "",
        password: "",
        isPasswordVisible: false,
        isSubmitting: false,
        autoSubmitTriggered: false,
        isCodeValid: false,
        isVerifyingCode: false,
        codeError: "",
    });

    // Мемоизированная схема валидации
    const currentSchema = useMemo(() => {
        switch (forgotPassword) {
            case 1:
                return forgotPasswordStep1;
            case 2:
                return forgotPasswordStep2;
            case 3:
                return forgotPasswordStep3;
            default:
                return forgotPasswordStep1;
        }
    }, [forgotPassword]) as any;

    // Обновление состояния
    const updateState = useCallback((updates: Partial<ForgotPasswordState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    }, []);

    // Переключение видимости пароля
    const togglePasswordVisibility = useCallback(() => {
        updateState({ isPasswordVisible: !state.isPasswordVisible });
    }, [state.isPasswordVisible, updateState]);

    // Обновление поля формы
    const updateField = useCallback(
        (field: keyof ForgotPasswordState, value: string) => {
            updateState({ [field]: value });

            // Сброс ошибки кода при изменении
            if (field === "code" && state.codeError) {
                updateState({ codeError: "" });
            }
        },
        [updateState, state.codeError]
    );

    // Сброс состояния при переходе между шагами
    const resetStepState = useCallback(() => {
        if (forgotPassword !== 2) {
            updateState({
                code: "",
                autoSubmitTriggered: false,
                isCodeValid: false,
                isVerifyingCode: false,
                codeError: "",
            });
        }
    }, [forgotPassword, updateState]);

    // Автоматическая отправка кода при вводе 6 цифр
    const handleAutoSubmit = useCallback(
        async (onSubmit: () => void) => {
            if (
                forgotPassword === 2 &&
                state.code.length === 6 &&
                !state.isSubmitting &&
                !isLoading &&
                !state.autoSubmitTriggered &&
                !state.isVerifyingCode
            ) {
                updateState({
                    autoSubmitTriggered: true,
                    isVerifyingCode: true,
                });

                // Небольшая задержка для избежания рекурсии
                setTimeout(() => {
                    onSubmit();
                }, 100);
            }
        },
        [
            forgotPassword,
            state.code.length,
            state.isSubmitting,
            state.autoSubmitTriggered,
            state.isVerifyingCode,
            isLoading,
            updateState,
        ]
    );

    // Основная логика отправки формы
    const handleSubmit = useCallback(
        async (data: ForgotPasswordFormData) => {
            if (state.isSubmitting) return;

            updateState({ isSubmitting: true });

            try {
                if (forgotPassword === 1) {
                    // Шаг 1: Отправка кода на email
                    await requestPasswordReset({ email: data.email });
                    setForgotPassword(2);
                    updateState({ email: data.email });
                } else if (forgotPassword === 2) {
                    // Шаг 2: Верификация кода
                    await verifyResetCode({
                        email: data.email,
                        code: data.code,
                    });
                    updateState({
                        isCodeValid: true,
                        isVerifyingCode: false,
                        codeError: "",
                    });
                    setForgotPassword(3);
                } else if (forgotPassword === 3) {
                    // Шаг 3: Сброс пароля
                    await confirmPasswordReset({
                        email: data.email,
                        code: data.code,
                        password: data.password,
                    });

                    // Задержка перед сбросом состояния
                    setTimeout(() => {
                        resetForgotPassword();
                        setState({
                            email: "",
                            code: "",
                            password: "",
                            isPasswordVisible: false,
                            isSubmitting: false,
                            autoSubmitTriggered: false,
                            isCodeValid: false,
                            isVerifyingCode: false,
                            codeError: "",
                        });
                    }, 1000);
                }
            } catch (error: any) {
                if (forgotPassword === 2) {
                    updateState({
                        isCodeValid: false,
                        isVerifyingCode: false,
                        codeError: "Неверный код подтверждения",
                    });
                }
                // Пробрасываем ошибку для обработки в компоненте
                throw error;
            } finally {
                updateState({
                    isSubmitting: false,
                    autoSubmitTriggered: false,
                });
            }
        },
        [
            state.isSubmitting,
            forgotPassword,
            requestPasswordReset,
            verifyResetCode,
            confirmPasswordReset,
            setForgotPassword,
            resetForgotPassword,
            updateState,
        ]
    );

    // Текст кнопки в зависимости от шага
    const buttonText = useMemo(() => {
        const texts = ["Отправить код", "Подтвердить код", "Изменить пароль"];
        return texts[forgotPassword - 1] || "Отправить код";
    }, [forgotPassword]);

    // Проверка активности кнопки
    const isButtonDisabled = useMemo(() => {
        return isLoading || state.isSubmitting;
    }, [isLoading, state.isSubmitting]);

    return {
        // Состояние
        ...state,
        currentSchema,
        buttonText,
        isButtonDisabled,

        // Методы
        updateField,
        togglePasswordVisibility,
        resetStepState,
        handleAutoSubmit,
        handleSubmit,

        // Данные из useAuth
        forgotPassword,
        isLoading,
    };
};

export default useForgotPassword;
