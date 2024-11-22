import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { response } from '../utils/response';

export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            const errorResponse = response(false, `Unexpected field: ${err.field}. Expected only one file.`, null);
            res.status(400).json(errorResponse);
            return
        }
    }

    if (err instanceof Error) {
        const parsedError = response(false, err.message, err); 
        res.status(400).json(parsedError);
        return;
    }
    next(err);
};