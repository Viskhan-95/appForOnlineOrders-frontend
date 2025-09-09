import React from "react";
import { View, SafeAreaView, ImageBackground } from "react-native";
import { rh } from "../../../utils/responsive";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "./styles";

const StepContainer: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../../assets/images/backgroundAuth.jpg")}
                style={styles.image}
            />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAwareScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { flexGrow: 1 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    extraScrollHeight={rh(19)}
                    extraHeight={rh(19)}
                >
                    {children}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
};

export default StepContainer;
