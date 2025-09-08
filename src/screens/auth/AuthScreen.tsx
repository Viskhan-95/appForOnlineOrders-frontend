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
import Header from "../../components/ui/Header";
import Title from "../../components/ui/Title";
import Subtitle from "../../components/ui/Subtitle";
import FormInput from "../../components/ui/FormInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { rh, rw } from "../../utils/responsive";
import Button from "../../components/ui/Button";
import GradientText from "../../components/ui/GradientText";

const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
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
                            style={styles.forgotPassword}
                            // onPress={() => navigation.navigate("ForgotPassword")}
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
                            backgroundColor={GRADIENT_COLORS.primary[0]}
                            textColor={COLORS.background}
                            onPress={() => console.log("Войти")}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: "center",
    },
    image: {
        width: rw(100),
        height: rh(100),
        opacity: 0.15,
        position: "absolute",
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "space-between",
        paddingVertical: rh(5),
    },
    header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: rh(10),
    },
    titleContainer: {
        alignItems: "center",
        marginTop: rh(8),
        gap: rh(2),
    },
    formContainer: {
        flex: 1,
        gap: rh(3),
    },
    forgotPassword: {
        marginVertical: rh(2),
    },
});
