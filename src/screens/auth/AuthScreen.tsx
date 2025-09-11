import React, { useState } from "react";
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

    const onSubmit = (data: LoginFormData) => {
        // TODO: интеграция с API авторизации
        console.log("submit login", data);
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
                                <View>
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
                                <View>
                                    <FormInput
                                        iconPassword={require("../../assets/icons/password.png")}
                                        iconEyeOff={require("../../assets/icons/eye-off.png")}
                                        iconEye={require("../../assets/icons/eye.png")}
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

                        <TouchableOpacity
                            style={styles.forgotPassword}
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
                        >
                            <Text>Войти</Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
};

export default AuthScreen;
