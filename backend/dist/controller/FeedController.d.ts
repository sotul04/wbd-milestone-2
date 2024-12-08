import { Request, Response } from "express";
export declare const FeedController: {
    createFeed: (req: Request, res: Response) => Promise<void>;
    readFeed: (req: Request, res: Response) => Promise<void>;
    updateFeed: (req: Request, res: Response) => Promise<void>;
    deleteFeed: (req: Request, res: Response) => Promise<void>;
    getFeeds: (req: Request, res: Response) => Promise<void>;
};
