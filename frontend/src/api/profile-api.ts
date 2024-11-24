import { BaseApi } from "./base-api";
import type { GetProfilePayload, GetProfileResponse, ProfileUpdatePayload, ProfileUpdateResponse } from "@/types";

export class ProfileApi extends BaseApi {
    public static async updateProfile(payload: ProfileUpdatePayload) {
        try {
            const formData = new FormData();
    
            if (payload.name) formData.append('name', payload.name);
            if (payload.work_history !== undefined) formData.append('work_history', payload.work_history || '');
            if (payload.skills !== undefined) formData.append('skills', payload.skills || '');
            if (payload.delete_photo !== undefined) {
                formData.append('delete_photo', payload.delete_photo.toString());
            }
    
            if (payload.profilePhotoFile) {
                formData.append('profile_photo', payload.profilePhotoFile);
            }
    
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
    
            const response = await this.client.put<ProfileUpdateResponse>(`/profile/${payload.userId}`, formData, config);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
    public static async getProfile(payload: GetProfilePayload) {
        try {
            const response = await this.client.get<GetProfileResponse>(`/profile/${payload.userId}`);
            return response.data;
        } catch (error) {
            throw (error as any)?.response?.data;
        }
    }
}