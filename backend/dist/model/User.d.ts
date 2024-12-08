import { FeedSerializable } from "./Feed";
import { z } from 'zod';
export type User = {
    id: bigint;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
};
export type UserProfile = {
    name: string | null;
    username: string;
    work_history?: string | null;
    skills?: string | null;
    profile_photo: string;
    relevant_posts?: FeedSerializable[] | null;
    connection_count: number;
    connect_status?: string | null;
};
export type UserCreate = {
    username: string;
    email: string;
    name: string;
    password: string;
};
export declare const userCreateSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    email: string;
    name: string;
    password: string;
}, {
    username: string;
    email: string;
    name: string;
    password: string;
}>;
export type UserUpdate = {
    id: bigint;
    name?: string | null;
    username?: string;
    profile_photo?: Express.Multer.File;
    work_history?: string | null;
    skills?: string | null;
    delete_photo?: boolean;
};
export declare const userUpdateParams: z.ZodObject<{
    userId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export declare const userUpdateSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    profile_photo: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    work_history: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    skills: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    username?: string | undefined;
    name?: string | undefined;
    profile_photo?: any;
    work_history?: string | null | undefined;
    skills?: string | null | undefined;
}, {
    username?: string | undefined;
    name?: string | undefined;
    profile_photo?: any;
    work_history?: string | null | undefined;
    skills?: string | null | undefined;
}>;
export type UserFindUnique = {
    username?: string;
    email?: string;
};
export type UserFindId = {
    id: bigint;
};
export type UserFindConnection = {
    idClient: bigint;
    idTarget: bigint;
};
export type UserAuth = {
    username: string;
    password: string;
};
export declare const userAuthSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const getProfileParams: z.ZodObject<{
    userId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
