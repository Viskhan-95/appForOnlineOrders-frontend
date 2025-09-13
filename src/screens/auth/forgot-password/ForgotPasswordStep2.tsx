import React from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { Controller } from "react-hook-form";
import { rh } from "../../../utils/responsive";
import FormInput from "../../../components/ui/FormInput";
import { COLORS } from "../../../utils/constants/colors";
import { ForgotPasswordFormData } from "../../../validations";

interface ForgotPasswordStep2Props {
    control: any;
    errors: any;
    codeValue: string;
    onCodeChange: (text: string) => void;
    codeError: string;
    isVerifyingCode: boolean;
    isCodeValid: boolean;
    isLoading: boolean;
}

const ForgotPasswordStep2: React.FC<ForgotPasswordStep2Props> = React.memo(
    ({
        control,
        errors,
        codeValue,
        onCodeChange,
        codeError,
        isVerifyingCode,
        isCodeValid,
        isLoading,
    }) => {
        const renderRightComponent = () => {
            if (isVerifyingCode) {
                return (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                );
            }

            if (isCodeValid) {
                return (
                    <Image
                        source={require("../../../assets/icons/check.png")}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.success,
                        }}
                    />
                );
            }

            return null;
        };

        return (
            <View style={{ marginBottom: rh(2) }}>
                <Controller
                    control={control}
                    name="code"
                    render={({ field: { onChange } }) => (
                        <View style={{ marginBottom: rh(2) }}>
                            <FormInput
                                icon={require("../../../assets/icons/passcode.png")}
                                placeholder="Отправленный на email код"
                                value={codeValue}
                                onChangeText={(text) => {
                                    onCodeChange(text);
                                    onChange(text);
                                }}
                                keyboardType="number-pad"
                                maxLength={6}
                                rightComponent={renderRightComponent()}
                                editable={!isLoading}
                            />
                            {(!!errors.code || codeError) && (
                                <Text style={{ color: COLORS.error }}>
                                    {codeError ||
                                        String(errors.code?.message || "")}
                                </Text>
                            )}
                        </View>
                    )}
                />
            </View>
        );
    }
);

ForgotPasswordStep2.displayName = "ForgotPasswordStep2";

export default ForgotPasswordStep2;
