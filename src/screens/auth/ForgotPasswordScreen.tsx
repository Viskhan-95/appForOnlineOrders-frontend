import React, { useState, useEffect } from "react";
import {
    ImageBackground,
    View,
    Text,
    ActivityIndicator,
    Image,
} from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { rh } from "../../utils/responsive";
import Header from "../../components/ui/Header";
import Title from "../../components/ui/Title";
import Subtitle from "../../components/ui/Subtitle";
import { Controller, useForm } from "react-hook-form";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    forgotPasswordStep1,
    forgotPasswordStep2,
    forgotPasswordStep3,
    ForgotPasswordFormData,
} from "../../validations";
import useAuth from "../../hooks/useAuth";

const ForgotPasswordScreen: React.FC = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeValue, setCodeValue] = useState("");
    const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);
    const [isCodeValid, setIsCodeValid] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [codeError, setCodeError] = useState("");

    const {
        isLoading,
        forgotPassword,
        requestPasswordReset,
        verifyResetCode,
        confirmPasswordReset,
        setForgotPassword,
        resetForgotPassword,
    } = useAuth();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    // Автоматическая отправка кода при вводе 6 цифр
    useEffect(() => {
        if (
            forgotPassword === 2 &&
            codeValue.length === 6 &&
            !isSubmitting &&
            !isLoading &&
            !autoSubmitTriggered &&
            !isVerifyingCode
        ) {
            console.log("Автоматическая отправка кода:", codeValue);
            setAutoSubmitTriggered(true);
            setIsVerifyingCode(true);
            setIsCodeValid(false);
            // Используем setTimeout для избежания рекурсии
            setTimeout(() => {
                handleSubmit(onSubmit)();
            }, 100);
        }
    }, [
        codeValue,
        forgotPassword,
        isSubmitting,
        isLoading,
        autoSubmitTriggered,
        isVerifyingCode,
    ]);

    // Сброс кода при переходе между шагами
    useEffect(() => {
        if (forgotPassword !== 2) {
            setCodeValue("");
            setAutoSubmitTriggered(false);
            setIsCodeValid(false);
            setIsVerifyingCode(false);
            setCodeError("");
        }
    }, [forgotPassword]);

    // Выбираем схему в зависимости от текущего шага
    const getCurrentSchema = () => {
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
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<any>({
        defaultValues: { email: "", password: "", code: "" },
        mode: "onChange",
        resolver: zodResolver(getCurrentSchema()),
    });

    const onSubmit = async (data: any) => {
        if (isSubmitting) {
            console.log("Уже выполняется отправка, пропускаем...");
            return;
        }

        setIsSubmitting(true);
        console.log("onSubmit вызвана с данными:", data);
        console.log("Текущий шаг forgotPassword:", forgotPassword);

        try {
            if (forgotPassword === 1) {
                // Шаг 1: Отправка кода на email
                console.log("Шаг 1: Отправка кода на email");
                await requestPasswordReset({ email: data.email });
                setForgotPassword(2); // Переходим к шагу 2
                console.log("Код отправлен на email:", data.email);
            } else if (forgotPassword === 2) {
                // Шаг 2: Верификация кода
                console.log("Шаг 2: Верификация кода");
                await verifyResetCode({ email: data.email, code: data.code });
                setIsCodeValid(true);
                setIsVerifyingCode(false);
                setCodeError("");
                setForgotPassword(3); // Переходим к шагу 3
                console.log("Код верифицирован");
            } else if (forgotPassword === 3) {
                // Шаг 3: Сброс пароля
                console.log("Шаг 3: Сброс пароля");
                await confirmPasswordReset({
                    email: data.email,
                    code: data.code,
                    password: data.password,
                });
                console.log("Пароль успешно изменен");
                // Добавляем задержку перед сбросом состояния
                setTimeout(() => {
                    resetForgotPassword();
                }, 1000);
            }
        } catch (error) {
            console.error("Ошибка:", error);
            if (forgotPassword === 2) {
                setIsCodeValid(false);
                setIsVerifyingCode(false);
                setCodeError("Неверный код подтверждения");
            }
        } finally {
            setIsSubmitting(false);
            setAutoSubmitTriggered(false);
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
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { value, onChange } }) => (
                                <View style={{ marginBottom: rh(3) }}>
                                    <FormInput
                                        icon={require("../../assets/icons/email.png")}
                                        placeholder="Email"
                                        value={value}
                                        onChangeText={onChange}
                                        keyboardType="email-address"
                                    />
                                    {!!errors.email && (
                                        <Text style={{ color: COLORS.error }}>
                                            {String(errors.email.message)}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                        {forgotPassword >= 2 && (
                            <Controller
                                control={control}
                                name="code"
                                render={({ field: { value, onChange } }) => (
                                    <View style={{ marginBottom: rh(2) }}>
                                        <FormInput
                                            icon={require("../../assets/icons/passcode.png")}
                                            placeholder="Отправленный на email код"
                                            value={codeValue}
                                            onChangeText={(text) => {
                                                setCodeValue(text);
                                                onChange(text);
                                                if (codeError) {
                                                    setCodeError("");
                                                }
                                            }}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            rightComponent={
                                                isVerifyingCode ? (
                                                    <ActivityIndicator
                                                        size="small"
                                                        color={COLORS.primary}
                                                    />
                                                ) : isCodeValid ? (
                                                    <Image
                                                        source={require("../../assets/icons/checkmark.png")}
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            tintColor:
                                                                COLORS.success,
                                                        }}
                                                    />
                                                ) : null
                                            }
                                        />
                                        {(!!errors.code || codeError) && (
                                            <Text
                                                style={{ color: COLORS.error }}
                                            >
                                                {codeError ||
                                                    String(
                                                        errors.code?.message ||
                                                            ""
                                                    )}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            />
                        )}
                        {forgotPassword >= 3 && (
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { value, onChange } }) => (
                                    <View style={{ marginBottom: rh(2) }}>
                                        <FormInput
                                            iconPassword={require("../../assets/icons/password.png")}
                                            iconEyeOff={require("../../assets/icons/eye-closed.png")}
                                            iconEye={require("../../assets/icons/eye-open.png")}
                                            placeholder="Новый пароль"
                                            value={value}
                                            onChangeText={onChange}
                                            secureTextEntry={!isPasswordVisible}
                                            onTogglePassword={
                                                togglePasswordVisibility
                                            }
                                            isPasswordVisible={
                                                isPasswordVisible
                                            }
                                        />
                                        {!!errors.password && (
                                            <Text
                                                style={{ color: COLORS.error }}
                                            >
                                                {String(
                                                    errors.password.message
                                                )}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            />
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            gradientColors={GRADIENT_COLORS.primary}
                            textColor={COLORS.background}
                            onPress={() => {
                                console.log("Кнопка нажата!");
                                handleSubmit(onSubmit)();
                            }}
                            disabled={isLoading || isSubmitting}
                        >
                            <Text>
                                {isLoading || isSubmitting
                                    ? "Загрузка..."
                                    : [
                                          "Отправить код",
                                          "Подтвердить код",
                                          "Изменить пароль",
                                      ][forgotPassword - 1]}
                            </Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ForgotPasswordScreen;
