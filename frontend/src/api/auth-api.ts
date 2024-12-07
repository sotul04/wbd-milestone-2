import { BaseApi } from "./base-api";
import {
    AuthCheckResponse,
    LoginPayload,
    LoginResponse,
    RegisterPayload
} from "@/types";

export class AuthApi extends BaseApi {
    public static async checkAuth() {
        const response = await this.client.get<AuthCheckResponse>("/verify");
        return response.data;
    }

    public static async login(payload: LoginPayload) {
        try {
            const response = await this.client.post<LoginResponse>("/login", payload);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }

    public static async register(payload: RegisterPayload) {
        try {
            const response = await this.client.post<LoginResponse>("/register", payload);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }

    public static async logout() {
        try {
            await this.client.get("/logout");
        } catch (error) {
            throw (error as any)?.message;
        }
    }
}