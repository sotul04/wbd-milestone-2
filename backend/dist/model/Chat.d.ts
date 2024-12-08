import { z } from "zod";
export type ChatCreate = {
    message: string;
    from_id: bigint;
    to_id: bigint;
    timestamp: Date;
    room_id: bigint;
};
export type RoomChatCreate = {
    first_user_id: bigint;
    second_user_id: bigint;
};
export type RoomChatSearch = {
    roomId: bigint;
};
export declare const RoomChatSearchParams: z.ZodObject<{
    roomId: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
}, "strip", z.ZodTypeAny, {
    roomId: bigint;
}, {
    roomId: string;
}>;
export type ChatLoad = {
    cursor?: Date;
    roomId: bigint;
};
export declare const ChatLoadParams: z.ZodObject<{
    roomId: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
}, "strip", z.ZodTypeAny, {
    roomId: bigint;
}, {
    roomId: string;
}>;
export declare const ChatLoadQuery: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, Date, string>, Date, string>>;
}, "strip", z.ZodTypeAny, {
    cursor?: Date | undefined;
}, {
    cursor?: string | undefined;
}>;
export type ChatUserGet = {
    userId: bigint;
};
export type JoinChatData = {
    room_id: string;
};
export type SendMessageData = {
    message: string;
    from_id: string;
    to_id: string;
    timestamp: Date;
    room_id: string;
};
export type SendTyping = {
    room_id: string;
};
