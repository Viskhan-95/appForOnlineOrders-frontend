import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from "react-native";
import { styles } from "./styles";
import StepContainer from "./StepContainer";
import Title from "../../../components/ui/Title";
import Subtitle from "../../../components/ui/Subtitle";
import FormInput from "../../../components/ui/FormInput";
import ArrowBack from "../../../components/ui/ArrowBack";
import { COLORS, GRADIENT_COLORS } from "../../../utils/constans/colors";
import Button from "../../../components/ui/Button";
import { Controller, useFormContext } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import { useModal } from "../../../hooks/useModal";

type Props = {
    onPrev: () => void;
    onNext: () => void;
    email: string;
    onVerifyCode: (code: string) => Promise<void>;
};

const StepFour: React.FC<Props> = ({ onPrev, onNext, email, onVerifyCode }) => {
    const {
        control,
        formState: { errors },
        watch,
        setError,
        clearErrors,
    } = useFormContext();

    const { resendVerificationCode, verifyRegistration, isLoading } = useAuth();
    const { showError, showSuccess } = useModal();
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isCodeValid, setIsCodeValid] = useState(false);

    const verificationCode = watch("verificationCode");

    // Автоматическая проверка кода при вводе 6 цифр
    useEffect(() => {
        if (
            verificationCode &&
            verificationCode.length === 6 &&
            !isVerifying &&
            !isCodeValid
        ) {
            handleVerifyCode();
        }
    }, [verificationCode]);

    // Сбрасываем валидность кода при изменении кода
    useEffect(() => {
        if (verificationCode && verificationCode.length !== 6) {
            setIsCodeValid(false);
        }
    }, [verificationCode]);

    // Таймер обратного отсчета
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown]);

    // Форматирование времени для отображения
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Проверка кода
    const handleVerifyCode = async () => {
        if (!verificationCode || verificationCode.length !== 6) return;

        console.log("Проверяем код:", verificationCode, "для email:", email);
        setIsVerifying(true);
        clearErrors("verificationCode");

        try {
            await onVerifyCode(verificationCode);
            console.log(
                "Код верифицирован успешно, устанавливаем isCodeValid = true"
            );
            setIsCodeValid(true);
            // Кнопка "Продолжить" станет активной
        } catch (error: any) {
            console.log("Ошибка верификации кода:", error);
            setIsCodeValid(false); // Сбрасываем валидность кода при ошибке
            setError("verificationCode", {
                type: "manual",
                message: "Неверный код подтверждения",
            });
            // Показываем модалку с ошибкой
            showError(
                "Неверный код подтверждения. Проверьте код и попробуйте снова."
            );
        } finally {
            setIsVerifying(false);
        }
    };

    // Повторная отправка кода
    const handleResendCode = async () => {
        if (!canResend || isResending) return;

        console.log("Отправляем код повторно для email:", email);
        setIsResending(true);
        try {
            await resendVerificationCode({ email });
            console.log("Код отправлен повторно успешно");
            setCountdown(60);
            setCanResend(false);
        } catch (error) {
            console.error("Ошибка повторной отправки кода:", error);
            showError("Не удалось отправить код повторно. Попробуйте позже.");
        } finally {
            setIsResending(false);
        }
    };

    // Убрано: isReadyToSubmit больше не нужен

    return (
        <StepContainer>
            <ArrowBack onPress={onPrev} />
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Title textSize="xxl">Введите код подтверждения</Title>
                    <Subtitle>Мы отправили 6-значный код на {email}</Subtitle>
                </View>
            </View>

            <View style={styles.formContainer}>
                <Controller
                    control={control}
                    name="verificationCode"
                    rules={{
                        required: "Код подтверждения обязателен",
                        pattern: {
                            value: /^\d{6}$/,
                            message: "Код должен содержать 6 цифр",
                        },
                    }}
                    render={({ field: { value, onChange } }) => (
                        <View style={styles.marginBottom}>
                            <FormInput
                                icon={require("../../../assets/icons/passcode.png")}
                                placeholder="Введите 6-значный код"
                                value={value}
                                onChangeText={onChange}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                                rightComponent={
                                    isVerifying ? (
                                        <ActivityIndicator
                                            size="small"
                                            color={COLORS.primary}
                                        />
                                    ) : isCodeValid ? (
                                        <Image
                                            source={require("../../../assets/icons/check.png")}
                                            style={styles.successIcon}
                                        />
                                    ) : null
                                }
                            />
                            {!!errors.verificationCode && (
                                <Text style={styles.errorText}>
                                    {String(errors.verificationCode.message)}
                                </Text>
                            )}
                        </View>
                    )}
                />

                {/* Блок повторной отправки */}
                <View style={styles.resendContainer}>
                    {!canResend ? (
                        <Text style={styles.countdownText}>
                            Повторная отправка через {formatTime(countdown)}
                        </Text>
                    ) : (
                        <TouchableOpacity
                            onPress={handleResendCode}
                            disabled={isResending}
                            style={styles.resendButton}
                        >
                            <Text
                                style={[
                                    styles.resendText,
                                    isResending && styles.resendTextDisabled,
                                ]}
                            >
                                {isResending
                                    ? "Отправляем..."
                                    : "Отправить код повторно"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Button
                gradientColors={GRADIENT_COLORS.primary}
                textColor={COLORS.background}
                onPress={onNext}
                disabled={!isCodeValid || isVerifying}
            >
                <Text>Продолжить</Text>
            </Button>
        </StepContainer>
    );
};

export default StepFour;
