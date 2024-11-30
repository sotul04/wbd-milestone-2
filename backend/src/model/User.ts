import { FeedSerializable } from "./Feed";
import { z } from 'zod';

export type User = {
    id: bigint;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export type UserProfile = {
    name: string | null;
    username: string;
    work_history?: string | null;
    skills?: string | null;
    profile_photo: string;
    relevant_posts?: FeedSerializable[] | null;
    connection_count: number;
    connect_status?: string | null;
}

export type UserCreate = {
    username: string;
    email: string;
    name: string;
    password: string;
}

export const userCreateSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(8)
})

export type UserUpdate = {
    id: bigint;
    name?: string | null;
    username?: string;
    profile_photo?: Express.Multer.File;
    work_history?: string | null;
    skills?: string | null;
    delete_photo?: boolean;
}

export const userUpdateParams = z.object({
    userId: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'userId must be a valid bigint' }
    )
});

export const userUpdateSchema = z.object({
    username: z.string().trim().min(3).optional(),
    name: z.string().trim().min(3).optional(),
    profile_photo: z.any().nullable().optional(),
    work_history: z.string().nullable().optional(),
    skills: z.string().nullable().optional(),
});

export type UserFindUnique = {
    username?: string;
    email?: string;
}

export type UserFindId = {
    id: bigint;
}

export type UserFindConnection = {
    idClient: bigint;
    idTarget: bigint;
}

export type UserAuth = {
    username: string;
    password: string;
}

export const userAuthSchema = z.object({
    username: z.string(),
    password: z.string().min(8)
});

export const getProfileParams = z.object({
    userId: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'userId must be a valid bigint' }
    )
});