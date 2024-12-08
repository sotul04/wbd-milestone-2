"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFeedParams = exports.GetFeedsQuery = exports.FeedDeleteParams = exports.FeedUpdateParams = exports.FeedUpdateSchema = exports.FeedReadParams = exports.FeedCreateSchema = void 0;
const zod_1 = require("zod");
exports.FeedCreateSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(280)
});
exports.FeedReadParams = zod_1.z.object({
    id: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (error) {
            return false;
        }
    }, { message: "Id must be a valid number" }).transform((val) => BigInt(val))
});
exports.FeedUpdateSchema = zod_1.z.object({
    content: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(280)
});
exports.FeedUpdateParams = zod_1.z.object({
    id: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (error) {
            return false;
        }
    }, { message: "Id must be a valid number" }).transform((val) => BigInt(val))
});
exports.FeedDeleteParams = zod_1.z.object({
    id: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (error) {
            return false;
        }
    }, { message: "Id must be a valid number" }).transform((val) => BigInt(val))
});
exports.GetFeedsQuery = zod_1.z.object({
    cursor: zod_1.z.string().refine(val => {
        try {
            BigInt(val);
            return true;
        }
        catch (error) {
            return false;
        }
    }).transform(val => BigInt(val)).optional(),
    limit: zod_1.z.string().refine(val => {
        try {
            Number(val);
            return true;
        }
        catch (error) {
            return false;
        }
    }).transform(val => Number(val))
});
exports.GetFeedParams = zod_1.z.object({
    id: zod_1.z.string().refine((val) => {
        try {
            BigInt(val);
            return true;
        }
        catch (error) {
            return false;
        }
    }, { message: "Id must be a valid number" }).transform((val) => BigInt(val))
});
//# sourceMappingURL=Feed.js.map