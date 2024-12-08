"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatLoadQuery = exports.ChatLoadParams = exports.RoomChatSearchParams = void 0;
const zod_1 = require("zod");
exports.RoomChatSearchParams = zod_1.z.object({
    roomId: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'roomId must be a valid bigint' }).transform(val => BigInt(val))
});
exports.ChatLoadParams = zod_1.z.object({
    roomId: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'roomId must be a valid bigint' }).transform(val => BigInt(val))
});
exports.ChatLoadQuery = zod_1.z.object({
    cursor: zod_1.z.string()
        .datetime()
        .transform(val => new Date(val))
        .refine(date => !isNaN(date.getTime()))
        .optional(),
});
//# sourceMappingURL=Chat.js.map