import { z } from "zod";

export type FeedSerializable = {
    id: string;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: string;
}

export type FeedCreate = {
    content: string;
    user_id: bigint;
}

export const FeedCreateSchema = z.object({
    content: z.string().min(1).max(280)
})

export type FeedRead = {
    id: bigint;
}

export const FeedReadParams = z.object({
    id: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch (error) {
                return false;
            }
        },
        { message: "Id must be a valid number" }
    ).transform((val) => BigInt(val))
})

export type FeedUpdate = {
    id: bigint;
    userId: bigint;
    content: string;
}

export const FeedUpdateSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1)
        .max(280)
});

export const FeedUpdateParams = z.object({
    id: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch (error) {
                return false;
            }
        },
        { message: "Id must be a valid number" }
    ).transform((val) => BigInt(val))
})

export type FeedDelete = {
    id: bigint;
    userId: bigint;
}

export const FeedDeleteParams = z.object({
    id: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch (error) {
                return false;
            }
        },
        { message: "Id must be a valid number" }
    ).transform((val) => BigInt(val))
})

export type FeedsByUserId = {
    user_ids: string[];
    cursor?: number;
    limit: number;
}

export type GetFeeds = {
    userId: bigint;
    cursor?: bigint;
    limit: number;
}

export const GetFeedsQuery = z.object({
    cursor: z.string().refine(
        val => {
            try {
                BigInt(val);
                return true;
            } catch (error) {
                return false
            }
        }
    ).transform(val => BigInt(val)).optional(),
    limit: z.string().refine(
        val => {
            try {
                Number(val);
                return true;
            } catch (error) {
                return false;
            }
        }
    ).transform(val => Number(val))
})

export const GetFeedParams = z.object({
    id: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch (error) {
                return false;
            }
        },
        { message: "Id must be a valid number" }
    ).transform((val) => BigInt(val))
});
