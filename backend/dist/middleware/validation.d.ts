import { Request, Response, NextFunction } from "express";
import { z } from "zod";
export declare function validateRequestBody(schema: z.ZodObject<any, any>): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateRequestParams(schema: z.ZodObject<any, any>): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateQueryParams(schema: z.ZodObject<any, any>): (req: Request, res: Response, next: NextFunction) => void;
