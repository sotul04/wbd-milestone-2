import * as ChatModel from '../model/Chat';

import { prisma } from '../db';
import xss from 'xss';

export const ChatService = {
    createRoom: async (param: ChatModel.RoomChatCreate) => {
        try {
            const room = await prisma.roomChat.findFirst({
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
                const createdRoom = await prisma.roomChat.create({
                    data: {
                        first_user_id: param.first_user_id,
                        second_user_id: param.second_user_id
                    }
                });

                return createdRoom.id;
            }

            return room.id;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    addChat: async (param: ChatModel.ChatCreate) => {
        try {
            const cleanChat = { ...param };
            cleanChat.message = xss(cleanChat.message);
            const newChat = await prisma.chat.create({
                data: {
                    ...cleanChat,
                }
            });

            await prisma.roomChat.update({
                where: { id: newChat.room_id },
                data: {
                    updated_at: new Date(),
                    last_message: newChat.message,
                    last_sender_id: param.from_id
                }
            });

            return newChat;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    roomChatSearch: async (param: ChatModel.RoomChatSearch) => {
        try {
            const room = await prisma.roomChat.findUnique({
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

            return {
                ...room,
                first_user_id: room.first_user_id.toString(),
                second_user_id: room.second_user_id.toString(),
                first_user: {
                    ...room.first_user,
                    id: room.first_user.id.toString()
                },
                second_user: {
                    ...room.second_user,
                    id: room.second_user.id.toString()
                }
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    loadChat: async (param: ChatModel.ChatLoad) => {
        try {
            const chats = await prisma.chat.findMany({
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
                return {
                    ...chat,
                    from_id: chat.from_id.toString(),
                    to_id: chat.to_id.toString()
                }
            });

            const filtered = messages.slice(0, 10);

            const data = { messages: filtered, nextCursor: chats.length > 10 ? chats[10].timestamp : null };
            return data;

        } catch (error) {
            console.error("Error", error)
            throw error;
        }
    },

    getUserChats: async (param: ChatModel.ChatUserGet) => {
        try {
            const rooms = await prisma.roomChat.findMany({
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
                return {
                    ...room,
                    first_user: {
                        ...room.first_user,
                        id: room.first_user.id.toString()
                    },
                    second_user: {
                        ...room.second_user,
                        id: room.second_user.id.toString()
                    },
                    id: room.id.toString()
                }
            })

            return roomsFilter;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}