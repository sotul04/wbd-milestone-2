import { Request, Response } from "express";
export declare const NotificationController: {
    subscribe: (req: Request, res: Response) => Promise<void>;
    pushChat: (req: Request, res: Response) => Promise<void>;
    pushFeed: (req: Request, res: Response) => Promise<void>;
};
