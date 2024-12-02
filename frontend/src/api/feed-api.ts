import { CreateFeedPayload, CreateFeedResponse, DeleteFeedPayload, DeleteFeedResponse, GetUserFeedsPayload, GetUserFeedsResponse, readFeedPayload, readFeedResponse, UpdateFeedPayload, UpdateFeedResponse } from "@/types";
import { BaseApi } from "./base-api";

export class feedAPI extends BaseApi{
    public static async getUserFeeds(payload: GetUserFeedsPayload) {
        try {
            // Dynamically construct the query string
            const query = payload.cursor 
                ? `?cursor=${payload.cursor}&limit=${payload.limit}` 
                : `?limit=${payload.limit}`;
            
            const response = await this.client.get<GetUserFeedsResponse>(`/feed${query}`);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
    

    public static async createFeed(payload: CreateFeedPayload){
        try{
            const response = await this.client.post<CreateFeedResponse>(`/feed`, payload);
            return response.data;
        } catch(error){
            throw (error as any)?.response?.data;
        }
    }

    public static async readFeed(payload: readFeedPayload){
        try{
            const response = await this.client.get<readFeedResponse>(`/feed/${payload.id}`);
            return response.data;
        } catch(error){
            throw (error as any)?.response?.data;
        }
    }

    public static async updateFeed(payload: UpdateFeedPayload){
        try{
            const response = await this.client.put<UpdateFeedResponse>(`feed/${payload.id}`, payload);
            return response.data;
        } catch(error){
            throw (error as any)?.response?.data;
        }
    }

    public static async deleteFeed(payload: DeleteFeedPayload){
        try{
            const response = await this.client.delete<DeleteFeedResponse>(`feed/${payload.id}`);
            return response.data;
        } catch(error){
            throw (error as any)?.response?.data;
        }
    }
}