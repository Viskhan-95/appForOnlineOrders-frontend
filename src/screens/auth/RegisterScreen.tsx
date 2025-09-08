import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { rh, rw } from "../../utils/responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS, GRADIENT_COLORS } from "../../utils/constans/colors";
import Header from "../../components/ui/Header";
import Title from "../../components/ui/Title";
import Subtitle from "../../components/ui/Subtitle";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import GradientText from "../../components/ui/GradientText";
import { SIZES } from "../../utils/constans/sizes";

const RegisterScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
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
                    contentContainerStyle={[
                        styles.scrollContent,
                        { flexGrow: 1 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    extraScrollHeight={rh(19)}
                    extraHeight={rh(19)}
                >
                    <View style={styles.header}>
                        <Header />
                        <View style={styles.titleContainer}>
                            <Title textSize="xxl">Создайте свой аккаунт</Title>
                            <Subtitle>
                                Зарегистрируйтесь, чтобы продолжить
                            </Subtitle>
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
                        <FormInput
                            icon={require("../../assets/icons/phone.png")}
                            placeholder="Введите номер телефона"
                            keyboardType="name-phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                        <Button
                            backgroundColor={GRADIENT_COLORS.primary[0]}
                            textColor={COLORS.background}
                            onPress={() => console.log("Зарегистрироваться")}
                        >
                            <Text>Создать аккаунт</Text>
                        </Button>
                        <View style={styles.isAccount}>
                            <Text style={styles.isAccountText}>
                                Уже есть аккаунт?
                            </Text>
                            <TouchableOpacity
                            // onPress={() => navigation.navigate("ForgotPassword")}
                            >
                               <Text style={styles.isAccountLink}>Войти?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
};

export default RegisterScreen;

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
    isAccount: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: rh(2),
        gap: rw(2)
    },
    isAccountText: {
        color: COLORS.text,
        fontSize: SIZES.fontSize.lg,
    },
    isAccountLink: {
        color: COLORS.textLink,
        fontSize: SIZES.fontSize.lg,
    },
});
