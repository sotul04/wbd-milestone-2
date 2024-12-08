import { Request, Response } from "express";
export declare const ConnectionController: {
    getUsers: (req: Request, res: Response) => Promise<void>;
    connectionSend: (req: Request, res: Response) => Promise<void>;
    connectionDelete: (req: Request, res: Response) => Promise<void>;
    connectionConnect: (req: Request, res: Response) => Promise<void>;
    connectionRequests: (req: Request, res: Response) => Promise<void>;
    connectionList: (req: Request, res: Response) => Promise<void>;
};
