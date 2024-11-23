import { FeedSerializable } from "./Feed";
import { bigint, z, ZodError } from 'zod';

export type User = {
    id: bigint;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export type UserProfile = {
    name: string;
    description: string | null;
    profile_photo?: string | null;
    relevant_posts?: FeedSerializable[] | null;
    connection_count: number;
    experiences?: string | null;
    skills?: string | null;
    connect_status?: boolean | null;
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
    email?: string;
    name?: string;
    description?: string | null;
    profile_photo?: Express.Multer.File;
    skills?: string | null;
    experiences?: string | null;
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
    email: z.string().trim().email().optional(),
    name: z.string().trim().min(3).optional(),
    description: z.string().nullable().optional(),
    profile_photo: z.any().optional(),
    skills: z.string().nullable().optional(),
    experiences: z.string().nullable().optional(),
    delete_photo: z
        .union([z.boolean(), z.string().refine(val => val === 'true' || val === 'false' || val === undefined || val === '', {
            message: "delete_photo must be 'true' or 'false' as string"
        })]).optional()
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