import React from "react";
import { View, Text, Platform } from "react-native";
import FormInput from "../../ui/FormInput";
import { styles as stepStyles } from "../../../screens/auth/steps/styles";

type Props = {
    value: string;
    error?: string;
    onChange: (t: string) => void;
};

const HouseField: React.FC<Props> = ({ value, error, onChange }) => {
    return (
        <View style={stepStyles.marginBottom}>
            <View style={{ width: "100%" }}>
                <FormInput
                    placeholder="Дом"
                    value={value}
                    onChangeText={(t) => onChange(t.replace(/[^0-9\/-]/g, ""))}
                    keyboardType={Platform.select({
                        ios: "numbers-and-punctuation",
                        android: "visible-password",
                    })}
                />
                {!!error && <Text style={stepStyles.errorText}>{error}</Text>}
            </View>
        </View>
    );
};

export default HouseField;




