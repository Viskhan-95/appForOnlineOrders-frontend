import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";
import { SIZES } from "../../utils/constans/sizes";
import Header from "../../components/ui/Header";
import Title from "../../components/ui/Title";
import Subtitle from "../../components/ui/Subtitle";
import FormInput from "../../components/ui/FormInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { rh } from "../../utils/responsive";
import Button from "../../components/ui/Button";
import GradientText from "../../components/ui/GradientText";
import { styles } from "./styles";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../validations/schemas";
import useAuth from "../../hooks/useAuth";

const AuthScreen: React.FC = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const navigation = useAppNavigation();

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<LoginFormData>({
        defaultValues: { email: "", password: "" },
        mode: "onChange",
        resolver: zodResolver(loginSchema),
    });

    const { login, isLoading, error, clearAuthError } = useAuth();

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            // Успешный вход - навигация произойдет автоматически
        } catch (err) {
            // Ошибка уже обработана в Redux
            console.error("Login failed:", err);
        }
    };

    // Автоматическая очистка ошибок
    useEffect(() => {
        if (error) {
            setTimeout(() => clearAuthError(), 5000);
        }
    }, [error, clearAuthError]);

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
                    extraScrollHeight={rh(19)}
                    extraHeight={rh(19)}
                >
                    <View style={styles.header}>
                        <Header />
                        <View style={styles.titleContainer}>
                            <Title textSize="xxl">Войдите в свой профиль</Title>
                            <Subtitle>Войдите, чтобы продолжить</Subtitle>
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
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { value, onChange } }) => (
                                <View style={{ marginBottom: rh(2) }}>
                                    <FormInput
                                        iconPassword={require("../../assets/icons/password.png")}
                                        iconEyeOff={require("../../assets/icons/eye-closed.png")}
                                        iconEye={require("../../assets/icons/eye-open.png")}
                                        placeholder="Пароль"
                                        value={value}
                                        onChangeText={onChange}
                                        secureTextEntry={!isPasswordVisible}
                                        onTogglePassword={
                                            togglePasswordVisibility
                                        }
                                        isPasswordVisible={isPasswordVisible}
                                    />
                                    {!!errors.password && (
                                        <Text style={{ color: COLORS.error }}>
                                            {String(errors.password.message)}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("ForgotPassword")
                            }
                        >
                            <GradientText
                                gradientColors={GRADIENT_COLORS.primary}
                                fontSize={SIZES.fontSize.lg}
                                textAlign="right"
                            >
                                Забыли пароль?
                            </GradientText>
                        </TouchableOpacity>

                        <Button
                            gradientColors={GRADIENT_COLORS.primary}
                            textColor={COLORS.background}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isLoading}
                        >
                            <Text>{isLoading ? "Вход..." : "Войти"}</Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
};

export default AuthScreen;
