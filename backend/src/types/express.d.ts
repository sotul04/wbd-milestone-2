// types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { User } from './path/to/your/user/type'; // Import your User type or interface if needed

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}
