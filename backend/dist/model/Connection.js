"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionDeleteParams = exports.connectionListParams = exports.connectionConnectSchema = exports.connectionSendSchema = exports.usersGetQuery = void 0;
const zod_1 = require("zod");
exports.usersGetQuery = zod_1.z.object({
    search: zod_1.z.string().optional(),
});
exports.connectionSendSchema = zod_1.z.object({
    to: zod_1.z.union([zod_1.z.number().transform(val => BigInt(val)), zod_1.z.string().refine((val) => {
            try {
                BigInt(val);
                return true;
            }
            catch (_a) {
                return false;
            }
        }, { message: 'userId must be a valid bigint' }).transform(val => BigInt(val))]),
});
exports.connectionConnectSchema = zod_1.z.object({
    to: zod_1.z.union([zod_1.z.number().transform(val => BigInt(val)), zod_1.z.string().refine((val) => {
            try {
                BigInt(val);
                return true;
            }
            catch (_a) {
                return false;
            }
        }, { message: 'userId must be a valid bigint' })]),
    accept: zod_1.z.union([zod_1.z.boolean(), zod_1.z.string().refine(val => val === 'true' || val === 'false', {
            message: "accept must be 'true' or 'false' as string"
        }).transform(val => val === "true" ? true : false)])
});
exports.connectionListParams = zod_1.z.object({
    userId: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'userId must be a valid bigint' }).transform(val => BigInt(val))
});
exports.connectionDeleteParams = zod_1.z.object({
    to: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'userId must be a valid bigint' }).transform(val => BigInt(val))
});
//# sourceMappingURL=Connection.js.map