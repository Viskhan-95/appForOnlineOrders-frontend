import React from "react";
import { View, Text } from "react-native";
import { Controller } from "react-hook-form";
import { rh } from "../../../utils/responsive";
import FormInput from "../../../components/ui/FormInput";
import { COLORS } from "../../../utils/constants/colors";
import { ForgotPasswordFormData } from "../../../validations";

interface ForgotPasswordStep1Props {
    control: any;
    errors: any;
    onSubmit: (data: ForgotPasswordFormData) => void;
    isLoading: boolean;
}

const ForgotPasswordStep1: React.FC<ForgotPasswordStep1Props> = React.memo(
    ({ control, errors, onSubmit, isLoading }) => {
        return (
            <View style={{ marginBottom: rh(2) }}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { value, onChange } }) => (
                        <View style={{ marginBottom: rh(3) }}>
                            <FormInput
                                icon={require("../../../assets/icons/email.png")}
                                placeholder="Email"
                                value={value}
                                onChangeText={onChange}
                                keyboardType="email-address"
                                editable={!isLoading}
                            />
                            {!!errors.email && (
                                <Text style={{ color: COLORS.error }}>
                                    {String(errors.email.message)}
                                </Text>
                            )}
                        </View>
                    )}
                />
            </View>
        );
    }
);

ForgotPasswordStep1.displayName = "ForgotPasswordStep1";

export default ForgotPasswordStep1;
