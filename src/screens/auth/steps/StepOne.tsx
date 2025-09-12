import { useFormContext, Controller } from "react-hook-form";
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
import { useAppNavigation } from "../../../hooks/useAppNavigation";

type Props = { onNext: () => void };

const StepOne: React.FC<Props> = ({ onNext }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigation = useAppNavigation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

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
                <Controller
                    control={control}
                    name="email"
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                        <View style={styles.marginBottom}>
                            <FormInput
                                icon={require("../../../assets/icons/email.png")}
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
                    rules={{ required: true, minLength: 6 }}
                    render={({ field: { value, onChange } }) => (
                        <View style={styles.marginBottom}>
                            <FormInput
                                iconPassword={require("../../../assets/icons/password.png")}
                                iconEyeOff={require("../../../assets/icons/eye-closed.png")}
                                iconEye={require("../../../assets/icons/eye-open.png")}
                                placeholder="Пароль"
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry={!isPasswordVisible}
                                onTogglePassword={togglePasswordVisibility}
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

                <Controller
                    control={control}
                    name="phone"
                    rules={{ required: true, minLength: 10 }}
                    render={({ field: { value, onChange } }) => (
                        <View style={styles.marginBottom}>
                            <FormInput
                                icon={require("../../../assets/icons/phone.png")}
                                placeholder="Номер телефона"
                                value={value}
                                onChangeText={onChange}
                                keyboardType="phone-pad"
                            />
                            {!!errors.phone && (
                                <Text style={{ color: COLORS.error }}>
                                    {String(errors.phone.message)}
                                </Text>
                            )}
                        </View>
                    )}
                />
            </View>
            <Button
                gradientColors={GRADIENT_COLORS.primary}
                textColor={COLORS.background}
                onPress={onNext}
            >
                <Text>Создать аккаунт</Text>
            </Button>
            <View style={styles.isAccount}>
                <Text style={styles.isAccountText}>Уже есть аккаунт?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Auth")}>
                    <Text style={styles.isAccountLink}>Войти?</Text>
                </TouchableOpacity>
            </View>
        </StepContainer>
    );
};

export default StepOne;
