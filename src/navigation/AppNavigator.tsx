import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import AuthScreen from "../screens/auth/AuthScreen";

export type RootStackParamList = {
    Welcome: undefined;
    Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
