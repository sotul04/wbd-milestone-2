import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtHelper';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        try {
            const decoded = verifyToken(token);
            req.body.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    }

};
