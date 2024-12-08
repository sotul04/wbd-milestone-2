import { InputJsonValue } from "@prisma/client/runtime/library";
import { z } from "zod";
export type PushSubs = {
    user_id: bigint | null;
    endpoint: string;
    keys: InputJsonValue;
};
export declare const PushSubsSchema: z.ZodObject<{
    user_id: z.ZodEffects<z.ZodEffects<z.ZodNullable<z.ZodString>, string | null, string | null>, bigint | null, string | null>;
    endpoint: z.ZodString;
    keys: z.ZodEffects<z.ZodEffects<z.ZodAny, any, any>, string | number | boolean | import("@prisma/client/runtime/library").InputJsonObject | import("@prisma/client/runtime/library").InputJsonArray | {
        toJSON(): unknown;
    }, any>;
}, "strip", z.ZodTypeAny, {
    keys: string | number | boolean | import("@prisma/client/runtime/library").InputJsonObject | import("@prisma/client/runtime/library").InputJsonArray | {
        toJSON(): unknown;
    };
    user_id: bigint | null;
    endpoint: string;
}, {
    user_id: string | null;
    endpoint: string;
    keys?: any;
}>;
export type PushChatNotification = {
    name: string;
    to_id: bigint;
    room_id: bigint;
    message: string;
};
export declare const PushChatNotificationSchema: z.ZodObject<{
    name: z.ZodString;
    to_id: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
    room_id: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    name: string;
    to_id: bigint;
    room_id: bigint;
}, {
    message: string;
    name: string;
    to_id: string;
    room_id: string;
}>;
export type PushFeedNotification = {
    name: string;
    user_id: bigint;
    content: string;
};
export declare const PushFeedNotificationSchema: z.ZodObject<{
    name: z.ZodString;
    user_id: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, bigint, string>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    name: string;
    user_id: bigint;
}, {
    content: string;
    name: string;
    user_id: string;
}>;
