import React, { useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "./styles";
import Header from "../../components/ui/Header";
import Title from "../../components/ui/Title";
import Subtitle from "../../components/ui/Subtitle";
import { rh } from "../../utils/responsive";
import FormInput from "../../components/ui/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
    forgotPasswordSchema,
    type ForgotPasswordFormData,
} from "../../validations";
import Button from "../../components/ui/Button";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";

const ForgotPassword: React.FC = () => {
    const [code, setCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(true);
    const [isCodeVerified, setIsCodeVerified] = useState(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<ForgotPasswordFormData>({
        defaultValues: { email: "", password: "" },
        mode: "onChange",
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        console.log("submit forgot password", data);
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/images/background.jpg")}
                style={styles.image}
            />
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
                            <View>
                                <FormInput
                                    icon={require("../../assets/icons/email.png")}
                                    placeholder="Введите email"
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
                    {isCodeSent && (
                        <FormInput
                            icon={require("../../assets/icons/passcode.png")}
                            placeholder="Отправленный на email код"
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                        />
                    )}
                    {isCodeVerified && (
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { value, onChange } }) => (
                                <View>
                                    <FormInput
                                        iconPassword={require("../../assets/icons/password.png")}
                                        iconEyeOff={require("../../assets/icons/eye-off.png")}
                                        iconEye={require("../../assets/icons/eye.png")}
                                        placeholder="Новый пароль"
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
                    )}
                </View>
                <Button
                    gradientColors={GRADIENT_COLORS.primary}
                    textColor={COLORS.background}
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text>Отправить код</Text>
                </Button>
            </KeyboardAwareScrollView>
            <SafeAreaView style={styles.safeArea}></SafeAreaView>
        </View>
    );
};

export default ForgotPassword;
