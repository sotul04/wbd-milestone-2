import { Request, Response } from "express";
import { PushChatNotificationSchema, PushFeedNotificationSchema, PushSubsSchema } from "../model/Notification";
import { NotificationService } from "../services/NotificationService";
import { StatusCodes } from "http-status-codes";
import { response } from "../utils/response";
import webpush from "web-push";
import dotenv from "dotenv";
dotenv.config();

const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
}

webpush.setVapidDetails(
    `mailto:${process.env.EMAIL_ADDRESS!}`,
    vapidKeys.publicKey!,
    vapidKeys.privateKey!
)

export const NotificationController = {
    subscribe: async (req: Request, res: Response) => {
        try {
            const data = PushSubsSchema.parse(req.body);
            await NotificationService.subscribe({
                ...data
            });

            res.status(StatusCodes.OK).json(response(true, "Subscription added"));
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Subscription failed", error));
        }
    },

    pushChat: async (req: Request, res: Response) => {
        try {
            const data = PushChatNotificationSchema.parse(req.body);
            const notificationPayload = {
                title: "New Message",
                body: `${data.name} has send new message for you`,
                description: data.message,
                icon: "http://localhost:5173/purry.ico",
                data: {
                    url: `http://localhost:5173/chat/${data.room_id}`
                }
            }

            const targets = await NotificationService.pushChat(data);
            const subscriptions = targets.map((target) => {
                const keys = target.keys as { auth: string; p256dh: string };
                return {
                    endpoint: target.endpoint,
                    keys: {
                        auth: keys.auth,
                        p256dh: keys.p256dh,
                    },
                };
            });

            const sendNotifications = subscriptions.map(async (subscription) => {
                try {
                    await webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
                } catch (error) {
                    if ((error as any)?.statusCode === 410) {
                        console.log(`Subscription ${subscription.endpoint} is no longer valid. Removing from database.`);
                        await NotificationService.removeSubs(subscription.endpoint);
                    } else {
                        console.error("Error sending notification:", error);
                    }
                }
            });

            await Promise.all(sendNotifications);

            res.status(StatusCodes.OK).json(response(true, "Push notification added"));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Failed to add push notification", error));
        }
    },

    pushFeed: async (req: Request, res: Response) => {
        try {
            const data = PushFeedNotificationSchema.parse(req.body);
            const notificationPayload = {
                title: "New Feed",
                body: `${data.name} has posted new Feed`,
                icon: "http://localhost:5173/purry.ico",
                description: data.content,
                data: {
                    url: "http://localhost:5173/feed"
                }
            }

            const targets = await NotificationService.pushFeed(data);
            const subscriptions = targets.map((target) => {
                const keys = target.keys as { auth: string; p256dh: string };
                return {
                    endpoint: target.endpoint,
                    keys: {
                        auth: keys.auth,
                        p256dh: keys.p256dh,
                    }
                }
            });

            const sendNotifications = subscriptions.map(async (subscription) => {
                try {
                    await webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
                } catch (error) {
                    if ((error as any)?.statusCode === 410) {
                        console.log(`Subscription ${subscription.endpoint} is no longer valid. Removing from database.`);
                        await NotificationService.removeSubs(subscription.endpoint);
                    } else {
                        console.error("Error sending notification:", error);
                    }
                }
            });

            await Promise.all(sendNotifications);

            res.status(StatusCodes.OK).json(response(true, "Push notification added"));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Failed to add push notification", error));
        }
    }
}