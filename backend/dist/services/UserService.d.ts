import * as UserModel from '../model/User';
import { User } from '@prisma/client';
export declare const UserService: {
    createUser: (data: UserModel.UserCreate) => Promise<{
        id: bigint;
        username: string;
        email: string;
        work_history: string | null;
        skills: string | null;
        password_hash: string;
        full_name: string | null;
        profile_photo_path: string;
        created_at: Date;
        updated_at: Date;
    }>;
    updateUser: (data: UserModel.UserUpdate) => Promise<boolean>;
    authLogin: (authData: UserModel.UserAuth, user: User) => Promise<boolean>;
    getUser: (data: UserModel.UserAuth) => Promise<{
        id: bigint;
        username: string;
        email: string;
        work_history: string | null;
        skills: string | null;
        password_hash: string;
        full_name: string | null;
        profile_photo_path: string;
        created_at: Date;
        updated_at: Date;
    } | null>;
    userProfile: (data: UserModel.UserFindId) => Promise<{
        id: string | undefined;
        username?: string | undefined;
        email?: string | undefined;
        full_name?: string | null | undefined;
        profile_photo_path?: string | undefined;
    }>;
};
