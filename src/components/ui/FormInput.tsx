import React, { useState } from "react";
import {
    Image,
    ImageSourcePropType,
    KeyboardTypeOptions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../utils/constans/colors";
import { SIZES } from "../../utils/constans/sizes";
import { rh, rw } from "../../utils/responsive";
import { TYPOGRAPHY } from "../../utils/constans/typography";

type FormInputProps = {
    placeholder: string;
    value: string;
    secureTextEntry?: boolean;
    icon?: ImageSourcePropType;
    iconPassword?: ImageSourcePropType;
    iconEyeOff?: ImageSourcePropType;
    iconEye?: ImageSourcePropType;
    onChangeText: (text: string) => void;
    onTogglePassword?: () => void;
    isPasswordVisible?: boolean;
    keyboardType?: KeyboardTypeOptions;
    onFocus?: () => void;
    onBlur?: () => void;
    editable?: boolean;
    inputMode?:
        | "none"
        | "text"
        | "tel"
        | "url"
        | "email"
        | "numeric"
        | "decimal"
        | "search";
    autoComplete?:
        | "off"
        | "name"
        | "username"
        | "password"
        | "one-time-code"
        | "tel"
        | "email"
        | "postal-address"
        | "street-address";
    textContentType?:
        | "none"
        | "name"
        | "nickname"
        | "telephoneNumber"
        | "emailAddress"
        | "oneTimeCode"
        | "streetAddressLine1"
        | "streetAddressLine2";
};

const FormInput: React.FC<FormInputProps> = ({
    placeholder,
    value,
    secureTextEntry,
    icon,
    iconPassword,
    iconEyeOff,
    iconEye,
    onChangeText,
    onTogglePassword,
    isPasswordVisible,
    onFocus,
    onBlur,
    editable,
    keyboardType,
    inputMode,
    autoComplete,
    textContentType,
}) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = () => {
        setFocused(true);
        onFocus && onFocus();
    };

    const handleBlur = () => {
        setFocused(false);
        onBlur && onBlur();
    };

    const showCustomPlaceholder = !focused && !value;

    return (
        <View style={styles.container}>
            {icon && <Image source={icon} />}
            {iconPassword && <Image source={iconPassword} />}
            <View style={styles.inputWrap}>
                {showCustomPlaceholder && (
                    <Text style={styles.placeholderXs} numberOfLines={1}>
                        {placeholder}
                    </Text>
                )}
                <TextInput
                    style={styles.input}
                    placeholder={""}
                    placeholderTextColor={COLORS.textSecondary}
                    secureTextEntry={secureTextEntry}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={editable}
                    keyboardType={keyboardType}
                    inputMode={inputMode}
                    autoComplete={autoComplete as any}
                    textContentType={textContentType as any}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            {onTogglePassword && (
                <TouchableOpacity onPress={onTogglePassword}>
                    <Image source={isPasswordVisible ? iconEye : iconEyeOff} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default FormInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: COLORS.textSubtitle,
        width: rw(80),
        height: rh(7),
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.borderRadius.medium,
        tintColor: COLORS.text,
        paddingHorizontal: rw(4),
    },
    inputWrap: {
        flex: 1,
        justifyContent: "center",
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.regular,
        fontSize: SIZES.fontSize.lg,
        paddingLeft: rw(4),
    },
    placeholderXs: {
        position: "absolute",
        left: rw(4),
        right: rw(4),
        color: COLORS.textSecondary,
        fontFamily: TYPOGRAPHY.regular,
        fontSize: SIZES.fontSize.sm,
    },
});
