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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const db_1 = require("../db");
exports.NotificationService = {
    subscribe: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db_1.prisma.pushSubscription.upsert({
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
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    pushChat: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db_1.prisma.pushSubscription.findMany({
                where: {
                    user_id: data.to_id
                }
            });
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    pushFeed: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conns = yield db_1.prisma.connection.findMany({
                where: {
                    from_id: data.user_id
                },
                select: {
                    to_id: true
                }
            });
            const friends = conns.map(conn => conn.to_id);
            return yield db_1.prisma.pushSubscription.findMany({
                where: {
                    user_id: { in: friends }
                }
            });
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    removeSubs: (endpoint) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db_1.prisma.pushSubscription.delete({
                where: { endpoint }
            });
        }
        catch (error) {
            throw error;
        }
    })
};
//# sourceMappingURL=NotificationService.js.map