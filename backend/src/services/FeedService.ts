import * as FeedModel from "../model/Feed";

import {prisma} from '../db';
import xss from 'xss';

export const FeedService = {
    createFeed: async (param: FeedModel.FeedCreate) => {
        try {
            const sanitizedContent = xss(param.content);

            const createdFeed = await prisma.feed.create({
                data: {
                    content: sanitizedContent,
                    user_id: param.user_id
                },
            });

            const result = {
                ...createdFeed,
                id: createdFeed.id.toString(),
                user_id: createdFeed.user_id.toString(),
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    
    readFeed: async (param: FeedModel.FeedRead) => {
        try{
            const readFeed = await prisma.Feed.findUnique({
                where: {id: param.id}
            })

            const result = {
                ...readFeed,
                id: readFeed.id.toString(),
                user_id: readFeed.user_id.toString(),
            };

            return result;
        } catch (error){
            console.error(error);
            throw error;
        }
    },

    updateFeed: async (param: FeedModel.FeedUpdate) => {
        try{
            const cleanFeed = {...param};
            cleanFeed.content = xss(cleanFeed.content)
            cleanFeed.updated_at = new Date()
            const updatedFeed = await prisma.Feed.update({
                where: {id: param.id},
                data: {
                    ...cleanFeed
                }
            })

            const result = {
                ...updatedFeed,
                id: updatedFeed.id.toString(),
                user_id: updatedFeed.user_id.toString(),
            };

            return result;
        } catch (error){
            console.error(error);
            throw error;
        }
    },

    deleteFeed: async (param: FeedModel.FeedDelete) => {
        try{
            const deletedFeed = await prisma.Feed.delete({
                where: {id: param.id}
            })

            return deletedFeed.id;
        } catch (error){
            console.error(error);
            throw error;
        }
    },

    getFeedsByUserID: async (param: FeedModel.FeedsByUserId) => {
        try {
            const feeds = await prisma.feed.findMany({
                where: {
                    user_id: param.user_id,
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
    }    
}