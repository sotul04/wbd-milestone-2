import dotenv from 'dotenv';
import crypto from 'crypto';
import { GenerateTokenPayload, DecodedJwtPayload, JwtPayload } from '../types/express';

dotenv.config();

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET ?? "secret_key";
const TOKEN_TTL = 3600; // 1 hour in seconds

const base64URLEncode = (data: string | Buffer): string => {
    return Buffer.from(data)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

const base64URLDecode = (str: string): string => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString();
};

const generateSignature = (header: string, payload: string): string => {
    const signatureInput = `${header}.${payload}`;
    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(signatureInput)
        .digest();
    return base64URLEncode(signature);
};

export const generateToken = (payload: GenerateTokenPayload): string => {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const fullPayload: JwtPayload = {
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
        iat: now,
        exp: now + TOKEN_TTL
    };

    const encodedHeader = base64URLEncode(JSON.stringify(header));
    const encodedPayload = base64URLEncode(JSON.stringify(fullPayload));

    const signature = generateSignature(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyToken = (token: string): DecodedJwtPayload => {
    try {
        const [headerB64, payloadB64, signatureB64] = token.split('.');

        if (!headerB64 || !payloadB64 || !signatureB64) {
            throw new Error('Invalid token format');
        }

        const expectedSignature = generateSignature(headerB64, payloadB64);
        if (expectedSignature !== signatureB64) {
            throw new Error('Invalid signature');
        }

        const payload = JSON.parse(base64URLDecode(payloadB64)) as DecodedJwtPayload;

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            throw new Error('Token has expired');
        }

        if (
            typeof payload.userId !== 'string' ||
            typeof payload.email !== 'string' ||
            typeof payload.name !== 'string' ||
            typeof payload.iat !== 'number' ||
            typeof payload.exp !== 'number'
        ) {
            throw new Error('Invalid payload format');
        }

        return payload;
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
};