export type FeedCreate = {
    id: string;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: string;
}

export type FeedRead = {
    id: string;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: string;
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
}