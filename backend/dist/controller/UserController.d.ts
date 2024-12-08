import { Request, Response } from "express";
export declare const UserController: {
    login: (req: Request, res: Response) => Promise<void>;
    register: (req: Request, res: Response) => Promise<void>;
    logout: (_: Request, res: Response) => Promise<void>;
    verify: (req: Request, res: Response) => Promise<void>;
};
