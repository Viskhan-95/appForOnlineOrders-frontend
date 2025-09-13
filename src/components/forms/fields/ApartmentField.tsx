import React from "react";
import { View, Text } from "react-native";
import FormInput from "../../ui/FormInput";
import { styles as stepStyles } from "../../../screens/auth/steps/styles";

type Props = {
    value: string;
    error?: string;
    onChange: (t: string) => void;
};

const ApartmentField: React.FC<Props> = ({ value, error, onChange }) => {
    return (
        <View style={stepStyles.marginBottom}>
            <View style={{ width: "100%" }}>
                <FormInput
                    placeholder="Квартира"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                />
                {!!error && <Text style={stepStyles.errorText}>{error}</Text>}
            </View>
        </View>
    );
};

export default ApartmentField;





