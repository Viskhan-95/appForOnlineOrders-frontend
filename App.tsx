import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export type RootStackParamList = {
    Welcome: undefined;
    Auth: undefined;
    // Register: undefined;
    // ForgotPassword: undefined;
    // Home: undefined;
};

export default function App() {
    return (
        <NavigationContainer>
            <SafeAreaProvider>
                <StatusBar style="light"/>
                <AppNavigator />
            </SafeAreaProvider>
        </NavigationContainer>
    );
}
