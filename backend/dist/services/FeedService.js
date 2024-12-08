"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const db_1 = require("../db");
const xss_1 = __importDefault(require("xss"));
exports.FeedService = {
    createFeed: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sanitizedContent = (0, xss_1.default)(param.content);
            const newFeed = yield db_1.prisma.feed.create({
                data: {
                    content: sanitizedContent,
                    user_id: param.user_id
                },
            });
            return Object.assign(Object.assign({}, newFeed), { id: newFeed.id.toString(), user_id: newFeed.user_id.toString() });
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    readFeed: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFeed = yield db_1.prisma.feed.findUnique({
                where: { id: param.id },
                select: {
                    id: true,
                    content: true,
                    created_at: true,
                    updated_at: true,
                    user_id: true,
                    user: {
                        select: {
                            full_name: true,
                            profile_photo_path: true,
                        }
                    }
                }
            });
            if (!readFeed) {
                return null;
            }
            const result = Object.assign(Object.assign({}, readFeed), { id: readFeed.id.toString(), user_id: readFeed.user_id.toString() });
            return result;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    updateFeed: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const feed = yield db_1.prisma.feed.findUnique({
                where: { id: param.id }
            });
            if (!feed)
                throw new Error("Not Found");
            if (feed.user_id !== param.userId)
                throw new Error("Unauthorized");
            const cleanContent = (0, xss_1.default)(param.content);
            const updated = yield db_1.prisma.feed.update({
                where: { id: param.id },
                data: {
                    content: cleanContent,
                    updated_at: new Date()
                }
            });
            return Object.assign(Object.assign({}, updated), { id: updated.id.toString(), user_id: updated.user_id.toString() });
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    deleteFeed: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const feed = yield db_1.prisma.feed.findUnique({
                where: { id: param.id }
            });
            if (!feed)
                throw new Error("Not Found");
            if (feed.user_id !== param.userId)
                throw new Error("Unauthorized");
            yield db_1.prisma.feed.delete({
                where: { id: param.id }
            });
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    getFeedsByUserID: (param) => __awaiter(void 0, void 0, void 0, function* () {
        const userIds = param.user_ids.map((id) => BigInt(id));
        try {
            const feeds = yield db_1.prisma.feed.findMany({
                where: {
                    user_id: {
                        in: userIds
                    },
                },
                orderBy: {
                    id: "desc",
                },
                cursor: param.cursor
                    ? { id: param.cursor }
                    : undefined,
                skip: param.cursor ? 1 : 0,
                take: param.limit || 10,
            });
            return feeds;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    getFeeds: (param) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const friendConnections = yield db_1.prisma.connection.findMany({
                where: {
                    OR: [
                        { to_id: param.userId },
                    ],
                },
                select: {
                    from_id: true,
                    to_id: true,
                },
            });
            const friendIds = friendConnections.flatMap(connection => connection.from_id === param.userId ? connection.to_id : connection.from_id);
            const userIds = [param.userId, ...friendIds];
            const limit = param.limit > 0 ? param.limit : 10;
            const feeds = yield db_1.prisma.feed.findMany({
                where: param.cursor ? {
                    user_id: { in: userIds },
                    id: {
                        lte: param.cursor
                    }
                } : {
                    user_id: { in: userIds }
                },
                select: {
                    id: true,
                    created_at: true,
                    updated_at: true,
                    content: true,
                    user_id: true,
                    user: {
                        select: {
                            full_name: true,
                            profile_photo_path: true
                        }
                    }
                },
                orderBy: { created_at: 'desc' },
                take: limit + 1,
            });
            const feedsEn = feeds.map((feed, index) => {
                return Object.assign(Object.assign({}, feed), { id: feed.id.toString(), user_id: feed.user_id.toString() });
            });
            const filtered = feedsEn.slice(0, limit);
            const data = {
                feeds: filtered,
                nextCursor: feeds.length > limit ? feeds[limit].id.toString() : null,
                cursor: (_a = param.cursor) === null || _a === void 0 ? void 0 : _a.toString()
            };
            return data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
};
//# sourceMappingURL=FeedService.js.map