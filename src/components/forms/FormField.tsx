import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Controller, useFormContext } from "react-hook-form";
import FormInput from "../ui/FormInput";
import { COLORS } from "../../utils/constans/colors";
import { rh } from "../../utils/responsive";

type Props = React.ComponentProps<typeof FormInput> & {
    name: string;
};

const FormField: React.FC<Props> = ({ name, ...inputProps }) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name as any}
            render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
            }) => (
                <View style={{ width: "100%" }}>
                    <FormInput
                        {...inputProps}
                        value={value as any}
                        onChangeText={onChange}
                        onBlur={onBlur}
                    />
                    {!!error && (
                        <Text style={styles.errorText}>
                            {String(error.message)}
                        </Text>
                    )}
                </View>
            )}
        />
    );
};

export default FormField;

const styles = StyleSheet.create({
    errorText: {
        color: COLORS.error,
        marginTop: rh(0.5),
    },
});




