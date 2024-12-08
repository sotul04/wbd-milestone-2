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
exports.ConnectionController = void 0;
const response_1 = require("../utils/response");
const ConnectionService_1 = require("../services/ConnectionService");
const http_status_codes_1 = require("http-status-codes");
const Connection_1 = require("../model/Connection");
const jwtHelper_1 = require("../utils/jwtHelper");
exports.ConnectionController = {
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const token = (_a = req.cookies.jwt) !== null && _a !== void 0 ? _a : (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            const decoded = token && (0, jwtHelper_1.verifyToken)(token);
            const { search } = Connection_1.usersGetQuery.parse(req.query);
            const userSearch = typeof search === 'string' ? search : undefined;
            const users = yield ConnectionService_1.ConnectionService.getUsers({ search: userSearch, id: decoded === null || decoded === void 0 ? void 0 : decoded.userId });
            res.status(200).json((0, response_1.response)(true, 'Successfully retrieved the data', users));
        }
        catch (error) {
            console.error(error);
            res.status(500).json((0, response_1.response)(false, 'Internal server error', error));
        }
    }),
    connectionSend: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                res.status(401).json((0, response_1.response)(false, 'Unauthorized access'));
                return;
            }
            const { to } = Connection_1.connectionSendSchema.parse(req.body);
            if (to === BigInt(req.user.userId)) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, response_1.response)(false, 'User ID is invalid'));
                return;
            }
            const message = yield ConnectionService_1.ConnectionService.connectionSend({ from: BigInt(req.user.userId), to });
            res.status(200).json((0, response_1.response)(true, message));
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, response_1.response)(false, error.message, error));
                return;
            }
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, 'Internal server error', error));
        }
    }),
    connectionDelete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                res.status(401).json((0, response_1.response)(false, 'Unauthorized access'));
                return;
            }
            const { to } = Connection_1.connectionDeleteParams.parse(req.params);
            yield ConnectionService_1.ConnectionService.connectionDelete({ from: BigInt(req.user.userId), to });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, 'Connection deleted successfully'));
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, response_1.response)(false, error.message, error));
                return;
            }
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, 'Internal server error', error));
        }
    }),
    connectionConnect: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                res.status(401).json((0, response_1.response)(false, 'Unauthorized access'));
                return;
            }
            const data = Connection_1.connectionConnectSchema.parse(req.body);
            yield ConnectionService_1.ConnectionService.connectionConnect({ from: BigInt(req.user.userId), to: BigInt(data.to), accept: Boolean(data.accept) });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, `Successfully ${data.accept ? 'accepted' : 'rejected'} the request`));
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, response_1.response)(false, error.message, error));
                return;
            }
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, 'Internal server error', error));
        }
    }),
    connectionRequests: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                res.status(401).json((0, response_1.response)(false, 'Unauthorized access'));
                return;
            }
            const requests = yield ConnectionService_1.ConnectionService.connectionRequests({ id: BigInt(req.user.userId) });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, 'Successfully retrieved the data', requests));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, 'Internal server error', error));
        }
    }),
    connectionList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = Connection_1.connectionListParams.parse(req.params);
            const users = yield ConnectionService_1.ConnectionService.connectionList({ id: data.userId });
            res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.response)(true, 'Successfully retrieved the data', users));
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, response_1.response)(false, error.message, error));
                return;
            }
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, 'Internal server error', error));
        }
    }),
};
//# sourceMappingURL=ConnectionController.js.map