// types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: CustomJwtPayload;
        }
    }
}

export interface CustomJwtPayload extends JwtPayload {
    userId: string;
    email: string;
    name: string;
    role: string;
}