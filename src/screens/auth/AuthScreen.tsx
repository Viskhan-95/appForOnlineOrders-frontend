import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";
import { SIZES } from "../../utils/constans/sizes";
import { TYPOGRAPHY } from "../../utils/constans/typography";
import Header from "../../components/ui/Header";
import Title from "../../components/ui/Title";
import Subtitle from "../../components/ui/Subtitle";
import FormInput from "../../components/ui/FormInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { rh, rw } from "../../utils/responsive";
import Button from "../../components/ui/Button";

const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <KeyboardAwareScrollView>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require("../../assets/images/backgroundAuth.jpg")}
                    style={styles.image}
                />
                <Header />
                <Title textSize="xxl">Войдите в свой профиль</Title>
                <Subtitle>Войдите, чтобы продолжить</Subtitle>
                <FormInput
                    icon={require("../../assets/icons/email.png")}
                    placeholder="Введите email"
                    value={email}
                    onChangeText={setEmail}
                />
                <FormInput
                    iconPassword={require("../../assets/icons/password.png")}
                    iconEyeOff={require("../../assets/icons/eye-off.png")}
                    iconEye={require("../../assets/icons/eye.png")}
                    placeholder="Введите пароль"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    onTogglePassword={togglePasswordVisibility}
                    isPasswordVisible={isPasswordVisible}
                />
                <TouchableOpacity
                // onPress={() => navigation.navigate("ForgotPassword")}
                >
                    <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
                </TouchableOpacity>
                <Button>
                    <Text>Войти</Text>
                </Button>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
};

export default AuthScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: rw(100),
        height: rh(100),
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    image: {
        width: rw(100),
        height: rh(100),
        opacity: 0.3,
        position: "absolute",
    },
    forgotPasswordGradient: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    forgotPasswordText: {
        color: COLORS.textLink,
        fontFamily: TYPOGRAPHY.regular,
        fontSize: SIZES.fontSize.sm,
    },
});
