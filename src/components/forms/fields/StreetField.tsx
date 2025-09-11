import React from "react";
import { View, Text } from "react-native";
import FormInput from "../../ui/FormInput";
import AutocompleteDropdown from "../../ui/AutocompleteDropdown";
import { rh, rw } from "../../../utils/responsive";
import { styles as stepStyles } from "../../../screens/auth/steps/styles";
import { StreetOption } from "../../../services/dadata";

type Props = {
    value: string;
    error?: string;
    onChange: (t: string) => void;
    options: StreetOption[];
    onPick: (opt: StreetOption) => void;
    focused: boolean;
    setFocused: (v: boolean) => void;
    loading?: boolean;
};

const StreetFieldBase: React.FC<Props> = ({
    value,
    error,
    onChange,
    options,
    onPick,
    focused,
    setFocused,
    loading,
}) => {
    return (
        <View>
            <View style={stepStyles.marginBottom}>
                <View style={{ width: "100%" }}>
                    <FormInput
                        placeholder="Улица"
                        value={value}
                        onChangeText={onChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 150)}
                    />
                    {!!error && (
                        <Text style={stepStyles.errorText}>{error}</Text>
                    )}
                </View>
            </View>
            <AutocompleteDropdown
                top={rh(7)}
                width={rw(80)}
                options={options}
                visible={focused && value.trim().length >= 3}
                loading={loading}
                onSelect={(o) => onPick(o as any)}
            />
        </View>
    );
};

const StreetField = React.memo(StreetFieldBase);
export default StreetField;
