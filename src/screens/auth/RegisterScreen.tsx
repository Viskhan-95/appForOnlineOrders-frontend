import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "../../validations";
import { useAuth } from "../../hooks/useAuth";
import { useAppNavigation } from "../../hooks/useAppNavigation";
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
                // Ошибка уже обработана в Redux
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
            // Пробрасываем ошибку в StepFour для обработки
            throw error;
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
