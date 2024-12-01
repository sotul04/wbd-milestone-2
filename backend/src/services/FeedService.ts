import * as FeedModel from "../model/Feed";

import {prisma} from '../db';

export const FeedService = {
    createFeed: async (param: FeedModel.FeedCreate) => {
        try{
            const createdFeed = await prisma.Feed.create({
                data: {
                    updated_at: param.updated_at,
                    content: param.content,
                    user_id: param.user_id
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
            const updatedFeed = await prisma.Feed.update({
                where: {id: param.id},
                data: {
                    updated_at: new Date(),
                    content: param.content
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
        try{
            const feeds = await prisma.Feed.findMany({
                where: {user_id: param.user_id}
            })
        } catch (error){
            console.error(error);
            throw error;
        }
    }
}