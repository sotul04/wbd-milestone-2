import dotenv from 'dotenv';
import app from './server';

dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`⚡️ Server running on port: ${PORT}`));