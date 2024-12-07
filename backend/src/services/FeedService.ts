import * as FeedModel from "../model/Feed";

import { prisma } from '../db';
import xss from 'xss';

export const FeedService = {
    createFeed: async (param: FeedModel.FeedCreate) => {
        try {
            const sanitizedContent = xss(param.content);

            const newFeed = await prisma.feed.create({
                data: {
                    content: sanitizedContent,
                    user_id: param.user_id
                },
            });
            return {
                ...newFeed,
                id: newFeed.id.toString(),
                user_id: newFeed.user_id.toString()
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    readFeed: async (param: FeedModel.FeedRead) => {
        try {
            const readFeed = await prisma.feed.findUnique({
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

            const result = {
                ...readFeed,
                id: readFeed.id.toString(),
                user_id: readFeed.user_id.toString(),
            };

            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateFeed: async (param: FeedModel.FeedUpdate) => {
        try {

            const feed = await prisma.feed.findUnique({
                where: { id: param.id }
            });

            if (!feed) throw new Error("Not Found");
            if (feed.user_id !== param.userId) throw new Error("Unauthorized");

            const cleanContent = xss(param.content);
            const updated = await prisma.feed.update({
                where: { id: param.id },
                data: {
                    content: cleanContent,
                    updated_at: new Date()
                }
            });

            return {
                ...updated,
                id: updated.id.toString(),
                user_id: updated.user_id.toString()
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    deleteFeed: async (param: FeedModel.FeedDelete) => {
        try {

            const feed = await prisma.feed.findUnique({
                where: { id: param.id }
            });

            if (!feed) throw new Error("Not Found");
            if (feed.user_id !== param.userId) throw new Error("Unauthorized");

            await prisma.feed.delete({
                where: { id: param.id }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getFeedsByUserID: async (param: FeedModel.FeedsByUserId) => {
        const userIds = param.user_ids.map((id) => BigInt(id))
        try {
            const feeds = await prisma.feed.findMany({
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
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getFeeds: async (param: FeedModel.GetFeeds) => {
        try {
            const friendConnections = await prisma.connection.findMany({
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

            const friendIds = friendConnections.flatMap(connection =>
                connection.from_id === param.userId ? connection.to_id : connection.from_id
            );

            const userIds = [param.userId, ...friendIds];
            const limit = param.limit > 0 ? param.limit : 10;

            const feeds = await prisma.feed.findMany({
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
                return {
                    ...feed,
                    id: feed.id.toString(),
                    user_id: feed.user_id.toString()
                }
            });

            const filtered = feedsEn.slice(0, limit);

            const data = {
                feeds: filtered,
                nextCursor: feeds.length > limit ? feeds[limit].id.toString() : null,
                cursor: param.cursor?.toString()
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
}