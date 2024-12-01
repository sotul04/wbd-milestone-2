import { Request, Response } from "express";
import { response } from '../utils/response';

import { StatusCodes } from 'http-status-codes';
import { ChatLoadParams, ChatLoadQuery, RoomChatSearchParams } from "../model/Chat";
import { ChatService } from "../services/ChatService";

export const ChatController = {
    loadChat: async (req: Request, res: Response) => {
        try {
            const { roomId } = ChatLoadParams.parse(req.params);
            const { cursor } = ChatLoadQuery.parse(req.query);
            const message = await ChatService.loadChat({ cursor, roomId });
            res.status(StatusCodes.OK).json(response(true, "Load Chat Success", message));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },
    getUserChats: async (req: Request, res: Response) => {
        try {
            const userId = req.user!.userId;
            const chats = await ChatService.getUserChats({ userId: BigInt(userId) });
            res.status(200).json(response(true, "Successfully retrieved the user chats", chats));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    },
    roomChatSearch: async (req: Request, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { roomId } = RoomChatSearchParams.parse(req.params);
            const chats = await ChatService.roomChatSearch({ roomId });
            if (chats.first_user_id !== userId && chats.second_user_id !== userId) {
                res.status(StatusCodes.UNAUTHORIZED).json(response(false, 'Unauthorized'));
                return;
            }
            res.status(200).json(response(true, "Successfully retrieved the room data", chats));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, "Internal server error", error));
        }
    }
}