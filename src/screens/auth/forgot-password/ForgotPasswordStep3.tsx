import React from "react";
import { View, Text } from "react-native";
import { Controller } from "react-hook-form";
import { rh } from "../../../utils/responsive";
import FormInput from "../../../components/ui/FormInput";
import { COLORS } from "../../../utils/constants/colors";
import { ForgotPasswordFormData } from "../../../validations";

interface ForgotPasswordStep3Props {
    control: any;
    errors: any;
    isPasswordVisible: boolean;
    onTogglePassword: () => void;
    isLoading: boolean;
}

const ForgotPasswordStep3: React.FC<ForgotPasswordStep3Props> = React.memo(
    ({ control, errors, isPasswordVisible, onTogglePassword, isLoading }) => {
        return (
            <View style={{ marginBottom: rh(2) }}>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange } }) => (
                        <View style={{ marginBottom: rh(2) }}>
                            <FormInput
                                iconPassword={require("../../../assets/icons/password.png")}
                                iconEyeOff={require("../../../assets/icons/eye-closed.png")}
                                iconEye={require("../../../assets/icons/eye-open.png")}
                                placeholder="Новый пароль"
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry={!isPasswordVisible}
                                onTogglePassword={onTogglePassword}
                                isPasswordVisible={isPasswordVisible}
                                editable={!isLoading}
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
        );
    }
);

ForgotPasswordStep3.displayName = "ForgotPasswordStep3";

export default ForgotPasswordStep3;
