import { Request, Response } from "express";
import { response } from '../utils/response';

import { StatusCodes } from 'http-status-codes';
import { ChatLoadParams, ChatLoadQuery } from "../model/Chat";
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
    }
}