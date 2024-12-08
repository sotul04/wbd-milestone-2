import * as FeedModel from "../model/Feed";
export declare const FeedService: {
    createFeed: (param: FeedModel.FeedCreate) => Promise<{
        id: string;
        user_id: string;
        content: string;
        created_at: Date;
        updated_at: Date;
    }>;
    readFeed: (param: FeedModel.FeedRead) => Promise<{
        id: string;
        user_id: string;
        content: string;
        user: {
            full_name: string | null;
            profile_photo_path: string;
        };
        created_at: Date;
        updated_at: Date;
    } | null>;
    updateFeed: (param: FeedModel.FeedUpdate) => Promise<{
        id: string;
        user_id: string;
        content: string;
        created_at: Date;
        updated_at: Date;
    }>;
    deleteFeed: (param: FeedModel.FeedDelete) => Promise<void>;
    getFeedsByUserID: (param: FeedModel.FeedsByUserId) => Promise<{
        content: string;
        id: bigint;
        created_at: Date;
        updated_at: Date;
        user_id: bigint;
    }[]>;
    getFeeds: (param: FeedModel.GetFeeds) => Promise<{
        feeds: {
            id: string;
            user_id: string;
            content: string;
            user: {
                full_name: string | null;
                profile_photo_path: string;
            };
            created_at: Date;
            updated_at: Date;
        }[];
        nextCursor: string | null;
        cursor: string | undefined;
    }>;
};
