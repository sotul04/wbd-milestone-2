import { z } from "zod";
export type FeedSerializable = {
    id: string;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: string;
};
export type FeedCreate = {
    content: string;
    user_id: bigint;
};
export declare const FeedCreateSchema: z.ZodObject<{
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
}, {
    content: string;
}>;
export type FeedRead = {
    id: bigint;
};
export declare const FeedReadParams: z.ZodObject<{
    id: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
}, "strip", z.ZodTypeAny, {
    id: bigint;
}, {
    id: string;
}>;
export type FeedUpdate = {
    id: bigint;
    userId: bigint;
    content: string;
};
export declare const FeedUpdateSchema: z.ZodObject<{
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
}, {
    content: string;
}>;
export declare const FeedUpdateParams: z.ZodObject<{
    id: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
}, "strip", z.ZodTypeAny, {
    id: bigint;
}, {
    id: string;
}>;
export type FeedDelete = {
    id: bigint;
    userId: bigint;
};
export declare const FeedDeleteParams: z.ZodObject<{
    id: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
}, "strip", z.ZodTypeAny, {
    id: bigint;
}, {
    id: string;
}>;
export type FeedsByUserId = {
    user_ids: string[];
    cursor?: number;
    limit: number;
};
export type GetFeeds = {
    userId: bigint;
    cursor?: bigint;
    limit: number;
};
export declare const GetFeedsQuery: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>>;
    limit: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, number, string>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    cursor?: bigint | undefined;
}, {
    limit: string;
    cursor?: string | undefined;
}>;
export declare const GetFeedParams: z.ZodObject<{
    id: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
}, "strip", z.ZodTypeAny, {
    id: bigint;
}, {
    id: string;
}>;
