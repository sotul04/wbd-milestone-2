import { Request, Response } from "express";
import { response } from '../utils/response';

import { StatusCodes } from 'http-status-codes';
import { FeedCreateSchema, FeedDeleteParams, FeedReadParams, FeedUpdateParams, FeedUpdateSchema, GetFeedsQuery } from "../model/Feed";
import { FeedService } from "../services/FeedService";

export const FeedController = {
    createFeed: async (req: Request, res: Response) => {
        try {
            const user_id = req.user!.userId;
            const { content } = FeedCreateSchema.parse(req.body);
            const feed = await FeedService.createFeed({ content, user_id: BigInt(user_id) });
            res.status(StatusCodes.OK).json(response(true, "Successfully created feed.", feed));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },

    readFeed: async (req: Request, res: Response) => {
        try {
            const { id } = FeedReadParams.parse(req.params);
            const message = await FeedService.readFeed({ id });

            if (!message) {
                res.status(StatusCodes.NOT_FOUND).json(response(false, "Not Found", null));
                return;
            }

            res.status(StatusCodes.OK).json(response(true, "Successfully retrieved the Feed", message));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },

    updateFeed: async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const { id } = FeedUpdateParams.parse(req.params);
        const { content } = FeedUpdateSchema.parse(req.body);
        try {
            const updated = await FeedService.updateFeed({ id, userId: BigInt(userId), content });
            res.status(StatusCodes.OK).json(response(true, "Update Feed Success", updated));
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Not Found') {
                    res.status(StatusCodes.NOT_FOUND).json(response(false, "Feed is not found", error));
                    return;
                }
                if (error.message === 'Unauthorized') {
                    res.status(StatusCodes.UNAUTHORIZED).json(response(false, "Unauthorized", error));
                    return;
                }
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },

    deleteFeed: async (req: Request, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { id } = FeedDeleteParams.parse(req.params);
            await FeedService.deleteFeed({ id, userId: BigInt(userId) });
            res.status(StatusCodes.OK).json(response(true, "Successfully deleted the feed"));
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Not Found') {
                    res.status(StatusCodes.NOT_FOUND).json(response(false, "Feed is not found", error));
                    return;
                }
                if (error.message === 'Unauthorized') {
                    res.status(StatusCodes.UNAUTHORIZED).json(response(false, "Unauthorized", error));
                    return;
                }
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },

    getFeeds: async (req: Request, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { limit, cursor } = GetFeedsQuery.parse(req.query);
            const feeds = await FeedService.getFeeds({ userId: BigInt(userId), cursor, limit });
            res.status(StatusCodes.OK).json(response(true, "Get Feeds Success", feeds));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },
}