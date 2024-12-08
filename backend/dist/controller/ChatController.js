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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const response_1 = require("../utils/response");
const http_status_codes_1 = require("http-status-codes");
const Chat_1 = require("../model/Chat");
const ChatService_1 = require("../services/ChatService");
exports.ChatController = {
    loadChat: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { roomId } = Chat_1.ChatLoadParams.parse(req.params);
            const { cursor } = Chat_1.ChatLoadQuery.parse(req.query);
            const message = yield ChatService_1.ChatService.loadChat({ cursor, roomId });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, "Load Chat Success", message));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Internal server error", error));
        }
    }),
    getUserChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const chats = yield ChatService_1.ChatService.getUserChats({ userId: BigInt(userId) });
            res.status(200).json((0, response_1.response)(true, "Successfully retrieved the user chats", chats));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Internal server error", error));
        }
    }),
    roomChatSearch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const { roomId } = Chat_1.RoomChatSearchParams.parse(req.params);
            const chats = yield ChatService_1.ChatService.roomChatSearch({ roomId });
            if (chats.first_user_id !== userId && chats.second_user_id !== userId) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json((0, response_1.response)(false, 'Unauthorized'));
                return;
            }
            res.status(200).json((0, response_1.response)(true, "Successfully retrieved the room data", chats));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, "Internal server error", error));
        }
    })
};
//# sourceMappingURL=ChatController.js.map