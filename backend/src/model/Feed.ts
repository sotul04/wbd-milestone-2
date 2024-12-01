import { z } from "zod";

export type FeedCreate = {
    id: string;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: string;
}

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

export type FeedDelete = {
    id: string;
}

export type FeedsByUserId = {
    user_id: string;
    cursor?: number;
    limit: number;
}

export const FeedReadParams = z.object({
    id: z.string().refine(
        (val) => 
            !isNaN(Number(val)
        ), 
        {message: "id must be a valid number"}
    ).transform((val) => Number(val))
});
