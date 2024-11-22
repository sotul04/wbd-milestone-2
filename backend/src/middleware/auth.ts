import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import { response } from '../utils/response';

export const authJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt ?? req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json(response(false, 'You are unauthenticated', 'Unauthorized access'));
        return;
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        console.log("Middleware",req.user);
        next();
    } catch (error) {
        res.status(401).json(response(false, 'Invalid or expired token', 'Token is invalid or expired'));
    }
}