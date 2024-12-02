import { z } from "zod";

export const FeedGetQuerySchema = z.object({
    cursor: z.string().optional(),
    limit: z.string().refine((val) => {
        const num = parseInt(val, 10);
        return num > 0 && num <= 10;
    }, { message: "Limit can only be between 1 and 10" }),
});

export type FeedCreate = {
    content: string;
    user_id: string;
}

export const FeedCreateSchema = z.object({
    content: z.string().min(1).max(280),
    user_id: z.string()
})

export type FeedRead = {
    id: string;
}

export type FeedUpdate = {
    id: string;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: string;
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
    user_id: string;
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
