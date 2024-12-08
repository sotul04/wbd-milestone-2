"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const SECRET_KEY = (_a = process.env.ACCESS_TOKEN_SECRET) !== null && _a !== void 0 ? _a : "secret_key";
const TOKEN_TTL = 3600; // 1 hour in seconds
const base64URLEncode = (data) => {
    return Buffer.from(data)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};
const base64URLDecode = (str) => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4)
        str += '=';
    return Buffer.from(str, 'base64').toString();
};
const generateSignature = (header, payload) => {
    const signatureInput = `${header}.${payload}`;
    const signature = crypto_1.default
        .createHmac('sha256', SECRET_KEY)
        .update(signatureInput)
        .digest();
    return base64URLEncode(signature);
};
const generateToken = (payload) => {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
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
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const [headerB64, payloadB64, signatureB64] = token.split('.');
        if (!headerB64 || !payloadB64 || !signatureB64) {
            throw new Error('Invalid token format');
        }
        const expectedSignature = generateSignature(headerB64, payloadB64);
        if (expectedSignature !== signatureB64) {
            throw new Error('Invalid signature');
        }
        const payload = JSON.parse(base64URLDecode(payloadB64));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            throw new Error('Token has expired');
        }
        if (typeof payload.userId !== 'string' ||
            typeof payload.email !== 'string' ||
            typeof payload.name !== 'string' ||
            typeof payload.iat !== 'number' ||
            typeof payload.exp !== 'number') {
            throw new Error('Invalid payload format');
        }
        return payload;
    }
    catch (err) {
        throw new Error('Invalid or expired token');
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwtHelper.js.map