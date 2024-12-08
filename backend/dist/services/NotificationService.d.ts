import { PushChatNotification, PushFeedNotification, PushSubs } from "../model/Notification";
export declare const NotificationService: {
    subscribe: (data: PushSubs) => Promise<void>;
    pushChat: (data: PushChatNotification) => Promise<{
        keys: import("@prisma/client/runtime/library").JsonValue;
        created_at: Date;
        user_id: bigint | null;
        endpoint: string;
    }[]>;
    pushFeed: (data: PushFeedNotification) => Promise<{
        keys: import("@prisma/client/runtime/library").JsonValue;
        created_at: Date;
        user_id: bigint | null;
        endpoint: string;
    }[]>;
    removeSubs: (endpoint: string) => Promise<void>;
};
