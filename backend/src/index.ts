import dotenv from 'dotenv';
import app from './server';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { JoinChatData, SendMessageData, SendTyping } from './model/Chat';
import { ChatService } from './services/ChatService';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const swaggerOptions = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: 'LinkPurry API Documentation',
            version: "1.0.0",
            description: 'API Documentation for LinkPurry',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Development server"
            }
        ]
    },
    apis: ['src/routes/index.ts']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http:localhost:5173',
        credentials: false,
    },
    transports: ['websocket'],
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_chat", (data: JoinChatData) => {
        socket.join(data.room_id);
        console.log(`User with ID: ${socket.id} joined room:`, data);
    });

    socket.on("send_message", async (data: SendMessageData) => {
        socket.to(data.room_id).emit("receive_message", data);
        ChatService.addChat({
            message: data.message,
            from_id: BigInt(data.from_id),
            to_id: BigInt(data.to_id),
            timestamp: data.timestamp,
            room_id: BigInt(data.room_id)
        })
    });

    socket.on("typing", (data: SendTyping) => {
        socket.to(data.room_id).emit("receive_typing", data);
    })

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
})

httpServer.listen(PORT, () => {
    console.log(`⚡️ Server running on port: ${PORT}`);
});