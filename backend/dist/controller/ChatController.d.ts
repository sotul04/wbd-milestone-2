import { Request, Response } from "express";
export declare const ChatController: {
    loadChat: (req: Request, res: Response) => Promise<void>;
    getUserChats: (req: Request, res: Response) => Promise<void>;
    roomChatSearch: (req: Request, res: Response) => Promise<void>;
};
