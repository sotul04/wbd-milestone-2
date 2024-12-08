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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const Notification_1 = require("../model/Notification");
const NotificationService_1 = require("../services/NotificationService");
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utils/response");
const web_push_1 = __importDefault(require("web-push"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
};
web_push_1.default.setVapidDetails(`mailto:${process.env.EMAIL_ADDRESS}`, vapidKeys.publicKey, vapidKeys.privateKey);
exports.NotificationController = {
    subscribe: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = Notification_1.PushSubsSchema.parse(req.body);
            yield NotificationService_1.NotificationService.subscribe(Object.assign({}, data));
            console.log("Subscription added for", data.user_id);
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, "Subscription added"));
        }
        catch (error) {
            console.error(error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Subscription failed", error));
        }
    }),
    pushChat: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = Notification_1.PushChatNotificationSchema.parse(req.body);
            const notificationPayload = {
                title: "New Message",
                body: `${data.name} has send new message for you`,
                description: data.message,
                icon: "http://localhost:5173/purry.ico",
                data: {
                    url: `http://localhost:5173/chat/${data.room_id}`
                }
            };
            const targets = yield NotificationService_1.NotificationService.pushChat(data);
            const subscriptions = targets.map((target) => {
                const keys = target.keys;
                return {
                    endpoint: target.endpoint,
                    keys: {
                        auth: keys.auth,
                        p256dh: keys.p256dh,
                    },
                };
            });
            const sendNotifications = subscriptions.map((subscription) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield web_push_1.default.sendNotification(subscription, JSON.stringify(notificationPayload));
                }
                catch (error) {
                    if ((error === null || error === void 0 ? void 0 : error.statusCode) === 410 || (error === null || error === void 0 ? void 0 : error.statusCode) === 401) {
                        console.log(`Subscription ${subscription.endpoint} is no longer valid or has mismatch key. Removing from database.`);
                        yield NotificationService_1.NotificationService.removeSubs(subscription.endpoint);
                    }
                    else {
                        console.error("Error sending notification:", error);
                    }
                }
            }));
            yield Promise.all(sendNotifications);
            console.log("Push notification for chats");
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, "Push notification added"));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Failed to add push notification", error));
        }
    }),
    pushFeed: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = Notification_1.PushFeedNotificationSchema.parse(req.body);
            const notificationPayload = {
                title: "New Feed",
                body: `${data.name} has posted new Feed`,
                icon: "http://localhost:5173/purry.ico",
                description: data.content,
                data: {
                    url: "http://localhost:5173/feed"
                }
            };
            const targets = yield NotificationService_1.NotificationService.pushFeed(data);
            const subscriptions = targets.map((target) => {
                const keys = target.keys;
                return {
                    endpoint: target.endpoint,
                    keys: {
                        auth: keys.auth,
                        p256dh: keys.p256dh,
                    }
                };
            });
            const sendNotifications = subscriptions.map((subscription) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield web_push_1.default.sendNotification(subscription, JSON.stringify(notificationPayload));
                }
                catch (error) {
                    if ((error === null || error === void 0 ? void 0 : error.statusCode) === 410 || (error === null || error === void 0 ? void 0 : error.statusCode) === 401) {
                        console.log(`Subscription ${subscription.endpoint} is no longer valid or has mismatch key. Removing from database.`);
                        yield NotificationService_1.NotificationService.removeSubs(subscription.endpoint);
                    }
                    else {
                        console.error("Error sending notification:", error);
                    }
                }
            }));
            yield Promise.all(sendNotifications);
            console.log("Push notification for feed");
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, "Push notification added"));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Failed to add push notification", error));
        }
    })
};
//# sourceMappingURL=NotificationController.js.map