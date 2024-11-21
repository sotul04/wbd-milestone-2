import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { authenticateJWT } from './middleware/auth';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/auth', authRoutes);

app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'You have access to this route', user: req.body.user });
});

app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
