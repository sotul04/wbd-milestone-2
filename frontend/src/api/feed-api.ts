import { CreateFeedPayload, CreateFeedResponse, DeleteFeedPayload, DeleteFeedResponse, GetFeedsPayload, GetFeedsResponse, ReadFeedPayload, ReadFeedResponse, UpdateFeedPayload, UpdateFeedResponse } from "@/types";
import { BaseApi } from "./base-api";

export class FeedApi extends BaseApi {
    public static async getFeeds(payload: GetFeedsPayload) {
        try {
            // // Dynamically construct the query string
            // const query = payload.cursor 
            //     ? `?cursor=${payload.cursor}&limit=${payload.limit}` 
            //     : `?limit=${payload.limit}`;

            // const response = await this.client.get<GetUserFeedsResponse>(`/feed${query}`, {
            //     headers: { "X-User-ID": JSON.stringify(payload.userIds)},
            // });

            // return response.data;
            const response = await this.client.get<GetFeedsResponse>(`/feed?limit=${payload.limit.toString()}${payload.cursor ? `&cursor=${payload.cursor}` : ''}`);
            return {
                data: response.data.body.feeds,
                currentPage: payload.cursor,
                nextPage: response.data.body.nextCursor
            }
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }


    public static async createFeed(payload: CreateFeedPayload) {
        try {
            const response = await this.client.post<CreateFeedResponse>(`/feed`, payload);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }

    public static async readFeed(payload: ReadFeedPayload) {
        try {
            const response = await this.client.get<ReadFeedResponse>(`/feed/${payload.id}`);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }

    public static async updateFeed(payload: UpdateFeedPayload) {
        try {
            const response = await this.client.put<UpdateFeedResponse>(`feed/${payload.id}`, { content: payload.content });
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }

    public static async deleteFeed(payload: DeleteFeedPayload) {
        try {
            const response = await this.client.delete<DeleteFeedResponse>(`feed/${payload.id}`);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
}