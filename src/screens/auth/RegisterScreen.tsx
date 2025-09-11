import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "../../validations";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";

const RegisterScreen: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

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
            role: ""
        },
    });

    const next = () => setStep((s) => (s < 4 ? ((s + 1) as typeof s) : s));
    const prev = () => setStep((s) => (s > 1 ? ((s - 1) as typeof s) : s));

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
        // TODO: отправка данных регистрации на бэкенд
        // await api.register(data)
        setStep(4);
    });

    return (
        <FormProvider {...methods}>
            {step === 1 && <StepOne onNext={handleNextStep1} />}
            {step === 2 && <StepTwo onPrev={prev} onNext={handleNextStep2} />}
            {step === 3 && (
                <StepThree
                    onPrev={prev}
                    onNext={handleSubmitAll}
                    // Вариант: если submit отдельно, можно заменить на handleNextStep3
                />
            )}
            {step === 4 && <StepFour onBackToAddress={() => setStep(3)} />}
        </FormProvider>
    );
};

export default RegisterScreen;
