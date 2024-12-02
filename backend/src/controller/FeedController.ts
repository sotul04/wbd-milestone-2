import { Request, Response } from "express";
import { response } from '../utils/response';

import { StatusCodes } from 'http-status-codes';
import { getFeedParams } from "../model/Feed";
import { FeedService } from "../services/FeedService";

export const FeedController = {
    createFeed: async (req: Request, res: Response) => {
        const { id, created_at, updated_at, content, user_id } = req.body;
        try{
            const message = await FeedService.createFeed({id, created_at, updated_at, content, user_id})
            res.status(StatusCodes.OK).json(response(true, "Create Feed Success", message));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },

    readFeed: async (req: Request, res: Response) => {
        try{
            const { id } = getFeedParams.parse(req.params);
            const message = await FeedService.readFeed({id});
            res.status(StatusCodes.OK).json(response(true, "Read Feed Success", message));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },

    updateFeed: async (req: Request, res: Response) => {
        const { id, created_at, updated_at, content, user_id } = req.body;
        try{
            const message = await FeedService.updateFeed({id, created_at, updated_at, content, user_id})
            res.status(StatusCodes.OK).json(response(true, "Update Feed Success", message));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },

    deleteFeed: async (req: Request, res: Response) => {
        try{
            const { id } = getFeedParams.parse(req.params);
            const message = await FeedService.deleteFeed({id})
            res.status(StatusCodes.OK).json(response(true, "Delete Feed Success", message));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },

    getFeeds: async (req: Request, res: Response) => {
        const { user_id } = req.body;
        try {
            const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
            const limit = req.query.limit ? Number(req.query.limit) : 10; // Default limit is 10

            const feeds = await FeedService.getFeedsByUserID({ user_id, cursor, limit });

            // Convert BigInt values to string
            const formattedFeeds = feeds.map((feed: any) => ({
                ...feed,
                id: feed.id?.toString(), // Convert BigInt to string
                created_at: feed.created_at?.toISOString(), // Format date if needed
                updated_at: feed.updated_at?.toISOString(), // Format date if needed
            }));

            res.status(StatusCodes.OK).json(response(true, "Get Feeds Success", formattedFeeds));
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },
}