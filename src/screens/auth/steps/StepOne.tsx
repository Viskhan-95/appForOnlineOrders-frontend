import { useFormContext } from "react-hook-form";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS, GRADIENT_COLORS } from "../../../utils/constans/colors";
import Header from "../../../components/ui/Header";
import Title from "../../../components/ui/Title";
import Subtitle from "../../../components/ui/Subtitle";
import FormInput from "../../../components/ui/FormInput";
import Button from "../../../components/ui/Button";
import { styles } from "./styles";
import StepContainer from "./StepContainer";

const StepOne = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const {
        register,
        setValue,
        formState: { errors },
        trigger,
    } = useFormContext();
    return (
        <StepContainer>
            <View style={styles.header}>
                <Header />
                <View style={styles.titleContainer}>
                    <Title textSize="xxl">Создайте свой аккаунт</Title>
                    <Subtitle>Зарегистрируйтесь, чтобы продолжить</Subtitle>
                </View>
            </View>
            <View style={styles.formContainer}>
                <FormInput
                    icon={require("../../../assets/icons/email.png")}
                    placeholder="Введите email"
                    value={email}
                    onChangeText={setEmail}
                />
                <FormInput
                    iconPassword={require("../../../assets/icons/password.png")}
                    iconEyeOff={require("../../../assets/icons/eye-off.png")}
                    iconEye={require("../../../assets/icons/eye.png")}
                    placeholder="Введите пароль"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    onTogglePassword={togglePasswordVisibility}
                    isPasswordVisible={isPasswordVisible}
                />
                <FormInput
                    icon={require("../../../assets/icons/phone.png")}
                    placeholder="Введите номер телефона"
                    keyboardType="name-phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>
            <Button
                backgroundColor={GRADIENT_COLORS.primary[0]}
                textColor={COLORS.background}
                onPress={() => console.log("Зарегистрироваться")}
            >
                <Text>Создать аккаунт</Text>
            </Button>
            <View style={styles.isAccount}>
                <Text style={styles.isAccountText}>Уже есть аккаунт?</Text>
                <TouchableOpacity
                // onPress={() => navigation.navigate("ForgotPassword")}
                >
                    <Text style={styles.isAccountLink}>Войти?</Text>
                </TouchableOpacity>
            </View>
        </StepContainer>
    );
};

export default StepOne;
