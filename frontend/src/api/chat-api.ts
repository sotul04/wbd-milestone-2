import { GetUserChatsResponse, LoadChatPayload, LoadChatResponse, RoomChatSearchPayload, RoomChatSearchResponse } from "@/types";
import { BaseApi } from "./base-api";

export class ChatApi extends BaseApi {
    public static async getUserChats() {
        try {
            const response = await this.client.get<GetUserChatsResponse>(`/chat/history`);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }

    public static async LoadChat(payload: LoadChatPayload) {
        try {
            const response = await this.client.get<LoadChatResponse>(`/chat/room/${payload.roomId}${payload.cursor ? `?cursor=${new Date(payload.cursor).toJSON()}` : ''}`);
            return {
                data: response.data.body.messages,
                currentPage: payload.cursor,
                nextPage: response.data.body.nextCursor
            }
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }

    public static async getRoomChatUsers(payload: RoomChatSearchPayload) {
        try {
            const response = await this.client.get<RoomChatSearchResponse>(`/chat/room/users/${payload.roomId}`);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
}