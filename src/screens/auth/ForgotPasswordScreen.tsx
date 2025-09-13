import React, { useEffect } from "react";
import { ImageBackground, View, Text } from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { rh } from "../../utils/responsive";
import Header from "../../components/ui/Header";
import Title from "../../components/ui/Title";
import Subtitle from "../../components/ui/Subtitle";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import { GRADIENT_COLORS, COLORS } from "../../utils/constants/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordFormData } from "../../validations";
import useForgotPassword from "../../hooks/useForgotPassword";
import useBackendErrorHandler from "../../hooks/useBackendErrorHandler";
import ForgotPasswordStep1 from "./forgot-password/ForgotPasswordStep1";
import ForgotPasswordStep2 from "./forgot-password/ForgotPasswordStep2";
import ForgotPasswordStep3 from "./forgot-password/ForgotPasswordStep3";

const ForgotPasswordScreen: React.FC = () => {
    const {
        // Состояние
        email,
        code,
        password,
        isPasswordVisible,
        isSubmitting,
        autoSubmitTriggered,
        isCodeValid,
        isVerifyingCode,
        codeError,
        currentSchema,
        buttonText,
        isButtonDisabled,
        forgotPassword,
        isLoading,

        // Методы
        updateField,
        togglePasswordVisibility,
        resetStepState,
        handleAutoSubmit,
        handleSubmit: handleForgotPasswordSubmit,
    } = useForgotPassword();
    const { handlePasswordResetError } = useBackendErrorHandler();

    // Сброс состояния при переходе между шагами
    useEffect(() => {
        resetStepState();
    }, [forgotPassword, resetStepState]);

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<ForgotPasswordFormData>({
        defaultValues: { email: "", password: "", code: "" },
        mode: "onChange",
        resolver: zodResolver(currentSchema) as any,
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await handleForgotPasswordSubmit(data);
        } catch (error) {
            // Обрабатываем ошибку восстановления пароля с показом соответствующей модалки
            handlePasswordResetError(error);
        }
    };

    // Автоматическая отправка кода при вводе 6 цифр
    useEffect(() => {
        handleAutoSubmit(() => handleSubmit(onSubmit)());
    }, [code, handleAutoSubmit, handleSubmit, onSubmit]);

    // Рендер компонента для текущего шага
    const renderCurrentStep = () => {
        switch (forgotPassword) {
            case 1:
                return (
                    <ForgotPasswordStep1
                        control={control}
                        errors={errors}
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                    />
                );
            case 2:
                return (
                    <ForgotPasswordStep2
                        control={control}
                        errors={errors}
                        codeValue={code}
                        onCodeChange={(text) => updateField("code", text)}
                        codeError={codeError}
                        isVerifyingCode={isVerifyingCode}
                        isCodeValid={isCodeValid}
                        isLoading={isLoading}
                    />
                );
            case 3:
                return (
                    <ForgotPasswordStep3
                        control={control}
                        errors={errors}
                        isPasswordVisible={isPasswordVisible}
                        onTogglePassword={togglePasswordVisibility}
                        isLoading={isLoading}
                    />
                );
            default:
                return null;
        }
    };
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/backgroundAuth.jpg")}
                style={styles.image}
            />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    extraScrollHeight={rh(15)}
                    extraHeight={rh(15)}
                >
                    <View style={styles.header}>
                        <Header />
                        <View style={styles.titleContainer}>
                            <Title textSize="xxl">Восстановление пароля</Title>
                            <Subtitle>
                                Введите email, для восстановления пароля
                            </Subtitle>
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        {renderCurrentStep()}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            gradientColors={GRADIENT_COLORS.primary}
                            textColor={COLORS.background}
                            onPress={() => handleSubmit(onSubmit)()}
                            disabled={isButtonDisabled}
                        >
                            <Text>
                                {isButtonDisabled ? "Загрузка..." : buttonText}
                            </Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ForgotPasswordScreen;
