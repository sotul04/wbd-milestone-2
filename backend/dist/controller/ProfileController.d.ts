import { Request, Response } from "express";
import multer from "multer";
export declare const upload: multer.Multer;
export declare const ProfileController: {
    profilUpdate: (req: Request, res: Response) => Promise<void>;
    getProfile: (req: Request, res: Response) => Promise<void>;
};
