import { CreateFeedResponse, DeleteFeedPayload, DeleteFeedResponse, GetUserFeedsPayload, GetUserFeedsResponse, readFeedPayload, readFeedResponse, UpdateFeedPayload, UpdateFeedResponse } from "@/types";
import { BaseApi } from "./base-api";

export class feedAPI extends BaseApi{
    public static async getUserFeeds(payload: GetUserFeedsPayload){
        try{
            const response = await this.client.get<GetUserFeedsResponse>(`/api/feed/${payload.cursor}?${payload.limit}`);
            return response.data;
        } catch(error){
            throw (error as any)?.response?.data;
        }
    }

    public static async createFeed(){
        try{
            const response = await this.client.post<CreateFeedResponse>(`/api/feed`);
            return response.data;
        } catch(error){
            throw (error as any)?.response?.data;
        }
    }

    public static async readFeed(payload: readFeedPayload){
        try{
            const response = await this.client.get<readFeedResponse>(`/api/feed/${payload.id}`);
            return response.data;
        } catch(error){
            throw (error as any)?.response?.data;
        }
    }

    public static async updateFeed(payload: UpdateFeedPayload){
        try{
            const response = await this.client.put<UpdateFeedResponse>(`/api/feed/${payload.id}`);
            return response.data;
        } catch(error){
            throw (error as any)?.response?.data;
        }
    }

    public static async deleteFeed(payload: DeleteFeedPayload){
        try{
            const response = await this.client.delete<DeleteFeedResponse>(`/api/feed/${payload.id}`);
            return response.data;
        } catch(error){
            throw (error as any)?.response?.data;
        }
    }
}