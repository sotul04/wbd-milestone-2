import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from 'http-status-codes';
import { response } from "../utils/response";

export function validateRequestBody(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            console.error('Body error', error);
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(StatusCodes.BAD_REQUEST).json(response(false, 'Invalid body data', errorMessages));
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, 'Internal server error', error));
            }
        }
    };
}

export function validateRequestParams(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error) {
            console.error('Params error', error);
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(StatusCodes.BAD_REQUEST).json(response(false, 'Invalid params', errorMessages));
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, 'Internal server error', error));
            }
        }
    };
}

export function validateQueryParams(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
            console.error('Query error', error);
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(StatusCodes.BAD_REQUEST).json(response(false, 'Invalid query data', errorMessages));
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, 'Internal server error', error));
            }
        }
    };
}
