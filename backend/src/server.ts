import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import path from 'path';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN_URL ?? "http://localhost:5173",
    credentials: true
}));

app.use(express.urlencoded({extended: true}));

app.use("/storage", express.static(path.join(__dirname, '../storage')));

app.use('/api', router);

export default app;

