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

const RegisterScreen: React.FC = () => {
    const {
        register,
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
        },
    });

    // Автоматическая очистка ошибок
    useEffect(() => {
        if (error) {
            setTimeout(() => clearAuthError(), 5000);
        }
    }, [error, clearAuthError]);

    const next = () =>
        setStep(registrationStep < 4 ? registrationStep + 1 : registrationStep);
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
        if (ok) next();
    };

    const handleSubmitAll = methods.handleSubmit(async (data) => {
        try {
            // Преобразуем данные формы в формат API
            const registerData: RegisterRequest = {
                email: data.email,
                password: data.password,
                name: `${data.firstName} ${data.lastName}`.trim(),
                phone: data.phone,
                address: `${data.city}, ${data.street}, д.${data.house}${
                    data.apartment ? `, кв.${data.apartment}` : ""
                }`,
                role: (data.role as "USER" | "ADMIN" | "SUPERADMIN") || "USER",
            };

            const result = await register(registerData);

            setStep(4);
        } catch (err) {
            // Ошибка уже обработана в Redux
        }
    });

    return (
        <FormProvider {...methods}>
            {registrationStep === 1 && <StepOne onNext={handleNextStep1} />}
            {registrationStep === 2 && (
                <StepTwo onPrev={prev} onNext={handleNextStep2} />
            )}
            {registrationStep === 3 && (
                <StepThree
                    onPrev={prev}
                    onNext={handleSubmitAll}
                    isLoading={isLoading}
                    error={error}
                />
            )}
            {registrationStep === 4 && (
                <StepFour onBackToAddress={() => setStep(3)} />
            )}
        </FormProvider>
    );
};

export default RegisterScreen;
