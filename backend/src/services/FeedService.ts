import * as FeedModel from "../model/Feed";

import {prisma} from '../db';
import xss from 'xss';

export const FeedService = {
    createFeed: async (param: FeedModel.FeedCreate) => {
        try{
            const cleanFeed = {...param};
            cleanFeed.content = xss(cleanFeed.content);
            const createdFeed = await prisma.Feed.create({
                data: {
                    ...cleanFeed
                }
            });

            return createdFeed.id;
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
                    id: "asc",
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
    };    
}