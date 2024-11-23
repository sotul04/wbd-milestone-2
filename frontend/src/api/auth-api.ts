import { getToken } from "@/lib/cookies";
import { BaseApi } from "./base-api";
import {
    AuthCheckResponse,
    LoginPayload,
    LoginResponse
} from "@/types";

export class AuthApi extends BaseApi {
    public static async checkAuth() {
        const token = getToken();
        if (!token) return null;
        try {
            const response = await this.client.get<AuthCheckResponse>("/verify");
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async login(payload: LoginPayload) {
        try {
            const response = await this.client.post<LoginResponse>("/login", payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}