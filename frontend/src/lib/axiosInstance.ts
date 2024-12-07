import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    timeout: 5000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
