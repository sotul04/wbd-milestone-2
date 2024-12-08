import { z } from 'zod';
export type UsersGet = {
    search?: string;
    id?: string;
};
export type UsersGetReturned = {
    id: string;
    can_connect?: boolean;
    email: string;
    full_name: string | null;
    work_history: string | null;
    profile_photo_path: string;
};
export declare const usersGetQuery: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
}, {
    search?: string | undefined;
}>;
export type ConnectionSend = {
    from: bigint;
    to: bigint;
};
export declare const connectionSendSchema: z.ZodObject<{
    to: z.ZodUnion<[z.ZodEffects<z.ZodNumber, bigint, number>, z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>]>;
}, "strip", z.ZodTypeAny, {
    to: bigint;
}, {
    to: string | number;
}>;
export type ConnectionRequests = {
    id: bigint;
};
export type ConnectionConnect = {
    from: bigint;
    to: bigint;
    accept: boolean;
};
export declare const connectionConnectSchema: z.ZodObject<{
    to: z.ZodUnion<[z.ZodEffects<z.ZodNumber, bigint, number>, z.ZodEffects<z.ZodString, string, string>]>;
    accept: z.ZodUnion<[z.ZodBoolean, z.ZodEffects<z.ZodEffects<z.ZodString, "true" | "false", string>, boolean, string>]>;
}, "strip", z.ZodTypeAny, {
    to: string | bigint;
    accept: boolean;
}, {
    to: string | number;
    accept: string | boolean;
}>;
export type ConnectionList = {
    id: bigint;
};
export declare const connectionListParams: z.ZodObject<{
    userId: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
}, "strip", z.ZodTypeAny, {
    userId: bigint;
}, {
    userId: string;
}>;
export type ConnectionDelete = {
    from: bigint;
    to: bigint;
};
export declare const connectionDeleteParams: z.ZodObject<{
    to: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
}, "strip", z.ZodTypeAny, {
    to: bigint;
}, {
    to: string;
}>;
