import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "../../validations";
import { useAuth } from "../../hooks/useAuth";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import useBackendErrorHandler from "../../hooks/useBackendErrorHandler";
import { RegisterRequest } from "../../types/auth";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import StepFive from "./steps/StepFive";

const RegisterScreen: React.FC = () => {
    const {
        register,
        startRegistration,
        verifyRegistration,
        isLoading,
        error,
        clearAuthError,
        registrationStep,
        setStep,
    } = useAuth();
    const navigation = useAppNavigation();
    const { handleRegistrationError } = useBackendErrorHandler();

    // Обработка ошибки регистрации с возможностью перехода к восстановлению пароля
    const handleRegistrationErrorWithNavigation = (error: any) => {
        const { message, code, statusCode } = error;

        // Если email уже существует, показываем модалку с возможностью восстановления пароля
        if (
            statusCode === 409 ||
            code === "EMAIL_EXISTS" ||
            message.includes("уже существует") ||
            message.includes("already exists")
        ) {
            // Здесь можно добавить логику для показа модалки с кнопкой "Восстановить пароль"
            // которая будет переводить на экран ForgotPassword
            handleRegistrationError(error);
            // navigation.navigate('ForgotPassword');
        } else {
            handleRegistrationError(error);
        }
    };

    const methods = useForm<RegisterFormData>({
        mode: "onChange",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            phone: "",
            firstName: "",
            lastName: "",
            city: "",
            street: "",
            house: "",
            apartment: "",
            role: "",
            verificationCode: "",
        },
    });

    // Автоматическая очистка ошибок
    useEffect(() => {
        if (error) {
            setTimeout(() => clearAuthError(), 5000);
        }
    }, [error, clearAuthError]);

    const next = () =>
        setStep(registrationStep < 5 ? registrationStep + 1 : registrationStep);
    const prev = () =>
        setStep(registrationStep > 1 ? registrationStep - 1 : registrationStep);

    // Валидация и переходы по шагам
    const handleNextStep1 = async () => {
        const ok = await methods.trigger(["email", "password", "phone"]);
        if (ok) next();
    };

    const handleNextStep2 = async () => {
        const ok = await methods.trigger(["firstName", "lastName"]);
        if (ok) next();
    };

    const handleNextStep3 = async () => {
        const ok = await methods.trigger(["city", "street", "house"]);
        if (ok) {
            // Отправляем email для получения кода подтверждения
            const data = methods.getValues();
            console.log(
                "Отправляем запрос на получение кода для email:",
                data.email
            );
            try {
                await startRegistration({ email: data.email });
                console.log("Код отправлен успешно, переходим к StepFour");
                next(); // Переходим к StepFour для ввода кода
            } catch (err) {
                console.log("Ошибка отправки кода:", err);
                // Обрабатываем ошибку регистрации с показом соответствующей модалки
                handleRegistrationErrorWithNavigation(err);
            }
        }
    };

    const handleVerifyCode = async (code: string) => {
        const data = methods.getValues();
        try {
            console.log("Отправляем запрос на верификацию кода...");
            console.log("Данные для верификации:", {
                email: data.email,
                code: code,
                name: `${data.firstName} ${data.lastName}`.trim(),
                phone: data.phone,
                address: `${data.city}, ${data.street}, д.${data.house}${
                    data.apartment ? `, кв.${data.apartment}` : ""
                }`,
                role: (data.role as "USER" | "ADMIN" | "SUPERADMIN") || "USER",
            });
            const result = await verifyRegistration({
                email: data.email,
                code: code,
                name: `${data.firstName} ${data.lastName}`.trim(),
                password: data.password,
                phone: data.phone,
                address: `${data.city}, ${data.street}, д.${data.house}${
                    data.apartment ? `, кв.${data.apartment}` : ""
                }`,
                role: (data.role as "USER" | "ADMIN" | "SUPERADMIN") || "USER",
            }).unwrap(); // Используем unwrap() для правильной обработки ошибок
            console.log("Верификация кода успешна:", result);
        } catch (error) {
            console.log("Ошибка верификации кода в RegisterScreen:", error);
            // Обрабатываем ошибку регистрации с показом соответствующей модалки
            handleRegistrationErrorWithNavigation(error);
            throw error; // Пробрасываем для StepFour
        }
    };

    const handleNextStep4 = async () => {
        // Переходим к StepFive после успешной верификации кода
        next();
    };

    return (
        <FormProvider {...methods}>
            {registrationStep === 1 && <StepOne onNext={handleNextStep1} />}
            {registrationStep === 2 && (
                <StepTwo onPrev={prev} onNext={handleNextStep2} />
            )}
            {registrationStep === 3 && (
                <StepThree
                    onPrev={prev}
                    onNext={handleNextStep3}
                    isLoading={isLoading}
                    error={error}
                />
            )}
            {registrationStep === 4 && (
                <StepFour
                    onPrev={prev}
                    onNext={handleNextStep4}
                    email={methods.getValues("email")}
                    onVerifyCode={handleVerifyCode}
                />
            )}
            {registrationStep === 5 && <StepFive />}
        </FormProvider>
    );
};

export default RegisterScreen;
