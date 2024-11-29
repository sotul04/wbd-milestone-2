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
    first_user_id: bigint;
    second_user_id: bigint;
}

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

