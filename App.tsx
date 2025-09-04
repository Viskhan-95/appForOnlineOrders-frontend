import { NavigationContainer } from "@react-navigation/native";

import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export type RootStackParamList = {
    Welcome: undefined;
    // Login: undefined;
    // Register: undefined;
    // ForgotPassword: undefined;
    // Home: undefined;
};

export default function App() {
    return (
        <NavigationContainer>
            <SafeAreaProvider>
                <AppNavigator />
            </SafeAreaProvider>
        </NavigationContainer>
    );
}
