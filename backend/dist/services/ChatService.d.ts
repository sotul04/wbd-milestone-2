import * as ChatModel from '../model/Chat';
export declare const ChatService: {
    createRoom: (param: ChatModel.RoomChatCreate) => Promise<bigint>;
    addChat: (param: ChatModel.ChatCreate) => Promise<{
        message: string;
        id: bigint;
        from_id: bigint;
        to_id: bigint;
        timestamp: Date;
        room_id: bigint;
    }>;
    roomChatSearch: (param: ChatModel.RoomChatSearch) => Promise<{
        first_user_id: string;
        second_user_id: string;
        first_user: {
            id: string;
            full_name: string | null;
            profile_photo_path: string;
        };
        second_user: {
            id: string;
            full_name: string | null;
            profile_photo_path: string;
        };
    }>;
    loadChat: (param: ChatModel.ChatLoad) => Promise<{
        messages: {
            from_id: string;
            to_id: string;
            message: string;
            timestamp: Date;
        }[];
        nextCursor: Date | null;
    }>;
    getUserChats: (param: ChatModel.ChatUserGet) => Promise<{
        first_user: {
            id: string;
            full_name: string | null;
            profile_photo_path: string;
        };
        second_user: {
            id: string;
            full_name: string | null;
            profile_photo_path: string;
        };
        id: string;
        updated_at: Date;
        last_message: string | null;
    }[]>;
};
