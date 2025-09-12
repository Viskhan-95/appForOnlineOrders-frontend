import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "./LoadingScreen";

const HomeScreen: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <View style={styles.container}>
            <LoadingScreen />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#111015",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 30,
    },
    userInfo: {
        marginBottom: 30,
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        color: "#FFFFFF",
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: "#FF0000",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    logoutText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default HomeScreen;
