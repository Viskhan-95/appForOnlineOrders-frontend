import axios, { AxiosInstance } from "axios";
import { API_URL } from "@env";

// Базовый API клиент без интерцепторов
export const baseApiClient: AxiosInstance = axios.create({
    baseURL: (API_URL || "http://localhost:3000") + "/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default baseApiClient;
