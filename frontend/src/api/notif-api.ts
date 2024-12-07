import { PushChatNotificationPayload, PushChatNotificationResponse, PushFeedNotificationPayload, PushFeedNotificationResponse, PushSubsPayload, PushSubsResponse } from "@/types";
import { BaseApi } from "./base-api";

export class NotifApi extends BaseApi {
    public static async subscribe(payload: PushSubsPayload) {
        try {
            const response = await this.client.post<PushSubsResponse>('/subscribe', payload);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }

    public static async pushChat(payload: PushChatNotificationPayload) {
        try {
            const response = await this.client.post<PushChatNotificationResponse>('/push/chat', payload);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }

    public static async pushFeed(payload: PushFeedNotificationPayload) {
        try {
            const response = await this.client.post<PushFeedNotificationResponse>('/push/feed', payload);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
}