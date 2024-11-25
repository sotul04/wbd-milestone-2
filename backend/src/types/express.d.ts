// types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: DecodedJwtPayload;
        }
    }
}

export interface JwtPayloadBase {
    userId: string;
    email: string;
    name: string;
}

export interface JwtPayload extends JwtPayloadBase {
    iat: number;
    exp: number;
}

export type GenerateTokenPayload = JwtPayloadBase;

export type DecodedJwtPayload = JwtPayload;