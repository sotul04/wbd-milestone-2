"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileParams = exports.userAuthSchema = exports.userUpdateSchema = exports.userUpdateParams = exports.userCreateSchema = void 0;
const zod_1 = require("zod");
exports.userCreateSchema = zod_1.z.object({
    username: zod_1.z.string()
        .min(3)
        .regex(/^[^\s@]+$/, "Username cannot be an email or contain '@'"),
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(3),
    password: zod_1.z.string().min(8),
});
exports.userUpdateParams = zod_1.z.object({
    userId: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'userId must be a valid bigint' })
});
exports.userUpdateSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .trim()
        .min(3)
        .regex(/^[^\s@]+$/, "Username cannot be an email or contain '@'")
        .optional(),
    name: zod_1.z.string().trim().min(3).optional(),
    profile_photo: zod_1.z.any().nullable().optional(),
    work_history: zod_1.z.string().nullable().optional(),
    skills: zod_1.z.string().nullable().optional(),
});
exports.userAuthSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().min(8)
});
exports.getProfileParams = zod_1.z.object({
    userId: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'userId must be a valid bigint' })
});
//# sourceMappingURL=User.js.map