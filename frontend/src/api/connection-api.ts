import { ConnectionConnectPayload, ConnectionConnectResponse, ConnectionDeletePayload, ConnectionListPayload, ConnectionListResponse, ConnectionRequestsResponse, ConnectionSendPayload, ConnectionSendResponse, GetUsersPayload, GetUsersResponse } from "@/types";
import { BaseApi } from "./base-api";

export class ConnectionApi extends BaseApi {
    public static async getUsers(payload: GetUsersPayload) {
        try {
            const response = await this.client.get<GetUsersResponse>(`/connection${payload.search ? `?search=${payload.search}` : ''}`);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
    public static async connectionSend(payload: ConnectionSendPayload) {
        try {
            const response = await this.client.post<ConnectionSendResponse>('/connection/send', payload);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
    public static async connectionRequests() {
        try {
            const response = await this.client.get<ConnectionRequestsResponse>('/connection/requests');
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
    public static async connectionConnect(payload: ConnectionConnectPayload) {
        try {
            const response = await this.client.post<ConnectionConnectResponse>('/connection/connect', payload);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
    public static async connectionList(payload: ConnectionListPayload) {
        try {
            const response = await this.client.get<ConnectionListResponse>(`/connection/list/${payload.userId}`);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
    public static async connectionDelete(payload: ConnectionDeletePayload) {
        try {
            const response = await this.client.delete<ConnectionConnectResponse>(`/connection/delete/${payload.to}`);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
}