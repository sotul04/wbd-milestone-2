import { PushSubs } from "../model/Notification";

import { prisma } from "../db";

export const NotificationService = {
    subscribe: async (data: PushSubs) => {
        try {
            await prisma.pushSubscription.upsert({
                where: { endpoint: data.endpoint},
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

    
}