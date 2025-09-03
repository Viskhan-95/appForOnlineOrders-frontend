import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppNavigator from "./src/navigation/AppNavigator";

export type RootStackParamList = {
    Welcome: undefined;
    // Login: undefined;
    // Register: undefined;
    // ForgotPassword: undefined;
    // Home: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <AppNavigator />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
