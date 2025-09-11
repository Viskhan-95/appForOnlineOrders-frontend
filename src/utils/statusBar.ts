import React from "react";
import { StatusBar } from "expo-status-bar";

export const DarkStatusBar: React.FC = () => {
    return React.createElement(StatusBar, { style: "light" });
};
