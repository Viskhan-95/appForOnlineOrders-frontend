import React from "react";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
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
}) => {
    return (
        <View style={styles.container}>
            {icon && <Image source={icon} />}
            {iconPassword && <Image source={iconPassword} />}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={COLORS.text}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
            />
            {onTogglePassword && (
                <TouchableOpacity
                    onPress={onTogglePassword}
                    style={styles.eyeButton}
                >
                    <Image
                        source={isPasswordVisible ? iconEye : iconEyeOff}
                        style={styles.iconEye}
                    />
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
        justifyContent: "flex-start",
        borderColor: COLORS.textSubtitle,
        width: rw(80),
        height: rh(7),
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.borderRadius.medium,
        tintColor: COLORS.text,
        paddingHorizontal: rw(4),
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.regular,
        fontSize: SIZES.fontSize.lg,
        paddingLeft: rw(4),
    },
    eyeButton: {},
    iconEye: {},
});
