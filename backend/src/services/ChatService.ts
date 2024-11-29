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
            const newChat =  await prisma.chat.create({
                data: {
                    ...cleanChat,
                }
            });

            await prisma.roomChat.update({
                where: {id: newChat.room_id},
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

            return room;
        } catch (error) {
            console.error(error)
            throw error;
        }
    },

    loadChat: async (param: ChatModel.ChatLoad) => {
        try {
            const chats = await prisma.chat.findMany({
                where: param.cursor ? {
                    room_id: param.roomId,
                    timestamp: {
                        lte: param.cursor
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
                take: 7
            });

            const messages = chats.map(chat => {
                return {
                    ...chat,
                    from_id: chat.from_id.toString(),
                    to_id: chat.to_id.toString()
                }
            })

            const data = { messages, nextCursor: chats.length > 6 ? chats[6].timestamp : null };
            return data;
        } catch (error) {
            console.error(error)
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