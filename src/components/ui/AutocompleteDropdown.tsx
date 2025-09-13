import React from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { rh, rw } from "../../utils/responsive";
import { COLORS } from "../../utils/constants/colors";

type Option = { label: string; fiasId?: string };

type AutocompleteDropdownProps = {
    top: number;
    options: Option[];
    onSelect: (opt: Option) => void;
    visible: boolean;
    width?: number; 
    noResultsText?: string;
    loading?: boolean;
};

const AutocompleteDropdownBase: React.FC<AutocompleteDropdownProps> = ({
    top,
    options,
    onSelect,
    visible,
    width,
    noResultsText = "Ничего не найдено",
    loading,
}) => {
    if (!visible) return null;

    const hasOptions = options.length > 0;

    return (
        <View
            style={[styles.dropdown, { top, width: width ? width : undefined }]}
        >
            {loading ? (
                <View style={styles.noResultsWrap}>
                    <Text style={styles.noResultsText}>Загрузка...</Text>
                </View>
            ) : hasOptions ? (
                <ScrollView keyboardShouldPersistTaps="handled">
                    {options.map((o) => (
                        <TouchableOpacity
                            key={o.fiasId || o.label}
                            style={styles.option}
                            onPress={() => onSelect(o)}
                        >
                            <Text style={styles.optionText}>{o.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.noResultsWrap}>
                    <Text style={styles.noResultsText}>{noResultsText}</Text>
                </View>
            )}
        </View>
    );
};

const AutocompleteDropdown = React.memo(AutocompleteDropdownBase);
export default AutocompleteDropdown;

const styles = StyleSheet.create({
    dropdown: {
        position: "absolute",
        left: 0,
        right: 0,
        maxHeight: 220,
        backgroundColor: COLORS.background,
        borderRadius: 10,
        paddingVertical: 6,
        zIndex: 1000,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    option: {
        paddingVertical: rh(1.8),
        paddingHorizontal: rw(3),
    },
    optionText: {
        color: COLORS.text,
    },
    noResultsWrap: {
        paddingVertical: rh(1.8),
        paddingHorizontal: rw(3),
    },
    noResultsText: {
        color: COLORS.textSecondary ?? COLORS.text,
    },
});
