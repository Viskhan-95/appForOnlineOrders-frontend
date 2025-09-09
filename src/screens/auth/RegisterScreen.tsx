import React, { useState } from "react";

import { FormProvider, useForm } from "react-hook-form";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";

const RegisterScreen: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    const methods = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            phone: "",
            firstName: "",
            lastName: "",
            address: "",
        },
    });

    return (
        <FormProvider {...methods}>
            <StepTwo />
            {/* <StepOne /> */}
            
        </FormProvider>
    );
};

export default RegisterScreen;

