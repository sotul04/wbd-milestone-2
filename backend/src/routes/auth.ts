import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtHelper';
import { prisma } from '../db';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid credentials' });
            } else {
                const token = generateToken({
                    userId: user.id.toString(),
                    email: user.email,
                    name: user.username,
                    role: 'jobseeker'
                });
        
                res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
                res.status(200).json({ message: 'Login successful', token });
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(403).json({ message: 'Very Bad Request11', error: error.stack});
        } else {
            res.status(403).json({ message: 'Unkown error'});
        }
    }
});

export default router;
