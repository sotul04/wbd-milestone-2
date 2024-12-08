"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./server"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const ChatService_1 = require("./services/ChatService");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
dotenv_1.default.config();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
const swaggerOptions = {
    definition: {
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
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Set up Swagger UI
server_1.default.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
server_1.default.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
});
server_1.default.get('/health', (_, res) => {
    res.status(200).json({ success: true });
});
const httpServer = (0, http_1.createServer)(server_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.ORIGIN_URL,
        credentials: false,
    },
    transports: ['websocket'],
});
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("join_chat", (data) => {
        socket.join(data.room_id);
        console.log(`User with ID: ${socket.id} joined room:`, data);
    });
    socket.on("send_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        socket.to(data.room_id).emit("receive_message", data);
        ChatService_1.ChatService.addChat({
            message: data.message,
            from_id: BigInt(data.from_id),
            to_id: BigInt(data.to_id),
            timestamp: data.timestamp,
            room_id: BigInt(data.room_id)
        });
    }));
    socket.on("typing", (data) => {
        socket.to(data.room_id).emit("receive_typing", data);
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
httpServer.listen(PORT, () => {
    console.log(`⚡️ Server running on port: ${PORT}`);
});
//# sourceMappingURL=index.js.map