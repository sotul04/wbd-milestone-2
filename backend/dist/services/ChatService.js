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
exports.ChatService = void 0;
const db_1 = require("../db");
const xss_1 = __importDefault(require("xss"));
exports.ChatService = {
    createRoom: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const room = yield db_1.prisma.roomChat.findFirst({
                where: {
                    OR: [
                        {
                            first_user_id: param.first_user_id,
                            second_user_id: param.second_user_id
                        },
                        {
                            first_user_id: param.second_user_id,
                            second_user_id: param.first_user_id
                        }
                    ]
                }
            });
            if (!room) {
                const createdRoom = yield db_1.prisma.roomChat.create({
                    data: {
                        first_user_id: param.first_user_id,
                        second_user_id: param.second_user_id
                    }
                });
                return createdRoom.id;
            }
            return room.id;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    addChat: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cleanChat = Object.assign({}, param);
            cleanChat.message = (0, xss_1.default)(cleanChat.message);
            const newChat = yield db_1.prisma.chat.create({
                data: Object.assign({}, cleanChat)
            });
            yield db_1.prisma.roomChat.update({
                where: { id: newChat.room_id },
                data: {
                    updated_at: new Date(),
                    last_message: newChat.message,
                    last_sender_id: param.from_id
                }
            });
            return newChat;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    roomChatSearch: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const room = yield db_1.prisma.roomChat.findUnique({
                where: {
                    id: param.roomId
                },
                select: {
                    first_user_id: true,
                    second_user_id: true,
                    first_user: {
                        select: {
                            profile_photo_path: true,
                            full_name: true,
                            id: true
                        }
                    },
                    second_user: {
                        select: {
                            profile_photo_path: true,
                            full_name: true,
                            id: true
                        }
                    }
                }
            });
            if (!room) {
                throw new Error("Room data not found");
            }
            return Object.assign(Object.assign({}, room), { first_user_id: room.first_user_id.toString(), second_user_id: room.second_user_id.toString(), first_user: Object.assign(Object.assign({}, room.first_user), { id: room.first_user.id.toString() }), second_user: Object.assign(Object.assign({}, room.second_user), { id: room.second_user.id.toString() }) });
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    loadChat: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chats = yield db_1.prisma.chat.findMany({
                where: param.cursor ? {
                    room_id: param.roomId,
                    timestamp: {
                        lte: new Date(param.cursor)
                    }
                } : {
                    room_id: param.roomId
                },
                select: {
                    message: true,
                    timestamp: true,
                    from_id: true,
                    to_id: true
                },
                orderBy: {
                    timestamp: 'desc'
                },
                take: 11
            });
            const messages = chats.map(chat => {
                return Object.assign(Object.assign({}, chat), { from_id: chat.from_id.toString(), to_id: chat.to_id.toString() });
            });
            const filtered = messages.slice(0, 10);
            const data = { messages: filtered, nextCursor: chats.length > 10 ? chats[10].timestamp : null };
            return data;
        }
        catch (error) {
            console.error("Error", error);
            throw error;
        }
    }),
    getUserChats: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rooms = yield db_1.prisma.roomChat.findMany({
                where: {
                    OR: [
                        { first_user_id: param.userId, },
                        { second_user_id: param.userId }
                    ]
                },
                select: {
                    id: true,
                    first_user: {
                        select: {
                            id: true,
                            full_name: true,
                            profile_photo_path: true
                        }
                    },
                    second_user: {
                        select: {
                            id: true,
                            full_name: true,
                            profile_photo_path: true
                        }
                    },
                    updated_at: true,
                    last_message: true
                },
                orderBy: {
                    updated_at: 'desc'
                },
            });
            const roomsFilter = rooms.map(room => {
                return Object.assign(Object.assign({}, room), { first_user: Object.assign(Object.assign({}, room.first_user), { id: room.first_user.id.toString() }), second_user: Object.assign(Object.assign({}, room.second_user), { id: room.second_user.id.toString() }), id: room.id.toString() });
            });
            return roomsFilter;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    })
};
//# sourceMappingURL=ChatService.js.map