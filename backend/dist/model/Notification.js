"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushFeedNotificationSchema = exports.PushChatNotificationSchema = exports.PushSubsSchema = void 0;
const zod_1 = require("zod");
exports.PushSubsSchema = zod_1.z.object({
    user_id: zod_1.z
        .string()
        .nullable()
        .refine((val) => {
        if (val === null)
            return true;
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: "user_id must be a valid bigint or null" })
        .transform((val) => (val === null ? null : BigInt(val))),
    endpoint: zod_1.z.string().min(1, "Endpoint cannot be empty"),
    keys: zod_1.z.any()
        .refine((value) => {
        try {
            JSON.stringify(value);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: "Keys must be a valid JSON object" })
        .transform((value) => value),
});
exports.PushChatNotificationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    to_id: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'user_id must be a valid bigint' }).transform(val => BigInt(val)),
    room_id: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'room_id must be a valid bigint' }).transform(val => BigInt(val)),
    message: zod_1.z.string().trim().min(1, "Message cannot be empty")
});
exports.PushFeedNotificationSchema = zod_1.z.object({
    name: zod_1.z.string().trim(),
    user_id: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'user_id must be a valid bigint' }).transform(val => BigInt(val)),
    content: zod_1.z.string().trim().min(1, "Content cannot be empty"),
});
//# sourceMappingURL=Notification.js.map