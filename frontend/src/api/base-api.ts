import apiClient from "@/lib/axiosInstance";

export class BaseApi {
    protected static client = apiClient;
}