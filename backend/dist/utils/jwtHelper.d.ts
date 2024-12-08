import { GenerateTokenPayload, DecodedJwtPayload } from '../types/express';
export declare const generateToken: (payload: GenerateTokenPayload) => string;
export declare const verifyToken: (token: string) => DecodedJwtPayload;
