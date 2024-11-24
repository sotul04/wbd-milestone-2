import axios from "axios";
import { getToken } from "./cookies";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

export default apiClient;
