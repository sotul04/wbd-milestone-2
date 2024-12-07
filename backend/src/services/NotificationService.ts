import { PushChatNotification, PushFeedNotification, PushSubs } from "../model/Notification";

import { prisma } from "../db";

export const NotificationService = {
    subscribe: async (data: PushSubs) => {
        try {
            await prisma.pushSubscription.upsert({
                where: { endpoint: data.endpoint },
                update: {
                    keys: data.keys,
                    user_id: data.user_id,
                    created_at: new Date(),
                },
                create: {
                    endpoint: data.endpoint,
                    keys: data.keys,
                    user_id: data.user_id
                }
            });

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    pushChat: async (data: PushChatNotification) => {
        try {
            return await prisma.pushSubscription.findMany({
                where: {
                    user_id: data.to_id
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    pushFeed: async (data: PushFeedNotification) => {
        try {
            const conns = await prisma.connection.findMany({
                where: {
                    from_id: data.user_id
                },
                select: {
                    to_id: true
                }
            });

            const friends = conns.map(conn => conn.to_id);

            return await prisma.pushSubscription.findMany({
                where: {
                    user_id: { in: friends }
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    removeSubs: async (endpoint: string) => {
        try {
            await prisma.pushSubscription.delete({
                where: { endpoint }
            })
        } catch (error) {
            throw error;
        }
    }
}