import { z } from "zod";

export type ChatCreate = {
    message: string;
    from_id: bigint;
    to_id: bigint;
    timestamp: Date;
    room_id: bigint;
}

export type RoomChatCreate = {
    first_user_id: bigint;
    second_user_id: bigint;
}

export type RoomChatSearch = {
    roomId: bigint;
}

export const RoomChatSearchParams = z.object({
    roomId: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'roomId must be a valid bigint' }
    ).transform(val => BigInt(val))
})

export type ChatLoad = {
    cursor?: Date;
    roomId: bigint
}

export const ChatLoadParams = z.object({
    roomId: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'roomId must be a valid bigint' }
    ).transform(val => BigInt(val))
});

export const ChatLoadQuery = z.object({
    cursor: z.string()
        .datetime()
        .transform(val => new Date(val))
        .refine(date => !isNaN(date.getTime()))
        .optional(),
});

export type ChatUserGet = {
    userId: bigint
}

export type JoinChatData = {
    room_id: string;
}

export type SendMessageData = {
    message: string;
    from_id: string;
    to_id: string;
    timestamp: Date;
    room_id: string;
}

export type SendTyping = {
    room_id: string;
}