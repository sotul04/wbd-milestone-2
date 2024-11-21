import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Ensure the port is correctly typed and falls back to 5000 if undefined
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
