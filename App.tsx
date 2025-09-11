import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DarkStatusBar } from "./src/utils/statusBar";
import { Provider as PaperProvider } from "react-native-paper";
import { paperDarkTheme } from "./src/theme/paperTheme";
import { Provider } from "react-redux";
import { store } from "./src/store";

export type RootStackParamList = {
    Welcome: undefined;
    Auth: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Home: undefined;
};

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <NavigationContainer>
                    <SafeAreaProvider>
                        <PaperProvider theme={paperDarkTheme}>
                            <DarkStatusBar />
                            <AppNavigator />
                        </PaperProvider>
                    </SafeAreaProvider>
                </NavigationContainer>
            </NavigationContainer>
        </Provider>
    );
}
