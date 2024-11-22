import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import { authJWT } from './middleware/auth';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.urlencoded({extended: true}));

app.use('/api', router);

app.get('/protected', authJWT, (req, res) => {
    res.json({ message: 'You have access to this route', user: req.body.user });
});

export default app;
