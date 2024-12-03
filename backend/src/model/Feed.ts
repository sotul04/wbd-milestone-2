import { z } from "zod";

export const FeedGetQuerySchema = z.object({
    cursor: z.string().optional(),
    limit: z.string().default("10").refine((val) => {
        const num = parseInt(val, 10);
        return num > 0 && num <= 10;
    }, { message: "Limit can only be between 1 and 10" }),
});

export type FeedCreate = {
    content: string;
    user_id: string;
}

export const FeedCreateSchema = z.object({
    content: z.string().min(1).max(280)
})

export type FeedRead = {
    id: string;
}

export const FeedReadSchema = z.object({
    id: z.string()
})

export type FeedUpdate = {
    id: string;
    content: string;
}

export const FeedUpdateSchema = z.object({
    content: z
    .string()
    .min(1)
    .max(280)
    .trim()
});

export type FeedDelete = {
    id: string;
}

export type FeedsByUserId = {
    user_ids: string[];
    cursor?: number;
    limit: number;
}

export const getFeedParams = z.object({
    id: z.string().refine(
        (val) => 
            !isNaN(Number(val)
        ), 
        {message: "id must be a valid number"}
    ).transform((val) => Number(val))
});
