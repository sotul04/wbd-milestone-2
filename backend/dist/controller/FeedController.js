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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedController = void 0;
const response_1 = require("../utils/response");
const http_status_codes_1 = require("http-status-codes");
const Feed_1 = require("../model/Feed");
const FeedService_1 = require("../services/FeedService");
exports.FeedController = {
    createFeed: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user_id = req.user.userId;
            const { content } = Feed_1.FeedCreateSchema.parse(req.body);
            const feed = yield FeedService_1.FeedService.createFeed({ content, user_id: BigInt(user_id) });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, "Successfully created feed.", feed));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Internal server error", error));
        }
    }),
    readFeed: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = Feed_1.FeedReadParams.parse(req.params);
            const message = yield FeedService_1.FeedService.readFeed({ id });
            if (!message) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json((0, response_1.response)(false, "Not Found", null));
                return;
            }
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, "Successfully retrieved the Feed", message));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Internal server error", error));
        }
    }),
    updateFeed: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.userId;
        const { id } = Feed_1.FeedUpdateParams.parse(req.params);
        const { content } = Feed_1.FeedUpdateSchema.parse(req.body);
        try {
            const updated = yield FeedService_1.FeedService.updateFeed({ id, userId: BigInt(userId), content });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, "Update Feed Success", updated));
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Not Found') {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json((0, response_1.response)(false, "Feed is not found", error));
                    return;
                }
                if (error.message === 'Unauthorized') {
                    res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json((0, response_1.response)(false, "Unauthorized", error));
                    return;
                }
            }
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Internal server error", error));
        }
    }),
    deleteFeed: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const { id } = Feed_1.FeedDeleteParams.parse(req.params);
            yield FeedService_1.FeedService.deleteFeed({ id, userId: BigInt(userId) });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, "Successfully deleted the feed"));
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Not Found') {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json((0, response_1.response)(false, "Feed is not found", error));
                    return;
                }
                if (error.message === 'Unauthorized') {
                    res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json((0, response_1.response)(false, "Unauthorized", error));
                    return;
                }
            }
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Internal server error", error));
        }
    }),
    getFeeds: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const { limit, cursor } = Feed_1.GetFeedsQuery.parse(req.query);
            const feeds = yield FeedService_1.FeedService.getFeeds({ userId: BigInt(userId), cursor, limit });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, "Get Feeds Success", feeds));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Internal server error", error));
        }
    }),
};
//# sourceMappingURL=FeedController.js.map