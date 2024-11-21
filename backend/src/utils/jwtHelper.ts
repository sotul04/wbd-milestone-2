import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET ?? "secret_key";
const TOKEN_TTL = 3600; // 1 hour

export const generateToken = (payload: object) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_TTL });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};
