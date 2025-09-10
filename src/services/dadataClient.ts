import axios from "axios";

const base = (
    process.env.EXPO_PUBLIC_DADATA_API_URL ||
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address"
).replace(/\/$/, "");

const token = process.env.EXPO_PUBLIC_DADATA_API_KEY;

export const dadataClient = axios.create({
    baseURL: base,
    timeout: 8000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

dadataClient.interceptors.request.use((config) => {
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Token ${token}`;
    }
    return config;
});
