import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomJwtPayload } from '../types/express';

dotenv.config();

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET ?? "secret_key";
const TOKEN_TTL = 3600; // 1 hour

export const generateToken = (payload: object) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_TTL });
};

export const verifyToken = (token: string): CustomJwtPayload => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;

        if (
            typeof decoded.userId === 'string' &&
            typeof decoded.email === 'string' &&
            typeof decoded.name === 'string' &&
            typeof decoded.role === 'string'
        ) {
            return decoded;
        }
        throw new Error('Invalid or expired token');
    } catch (err) {
        throw err;
    }
};
