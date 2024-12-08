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
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const jwtHelper_1 = require("../utils/jwtHelper");
const response_1 = require("../utils/response");
exports.UserController = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const user = yield UserService_1.UserService.getUser({ username, password });
            if (!user) {
                res.status(404).json((0, response_1.response)(false, 'User not found', 'Failed to get user'));
                return;
            }
            const isLogin = yield UserService_1.UserService.authLogin({ username, password }, user);
            if (!isLogin) {
                res.status(401).json((0, response_1.response)(false, 'Password do not match', 'Password comparation failed'));
                return;
            }
            const token = (0, jwtHelper_1.generateToken)({
                userId: user.id.toString(),
                email: user.email,
                name: user.username
            });
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, sameSite: true });
            res.status(200).json((0, response_1.response)(true, 'Login successful', { token: token }));
        }
        catch (error) {
            res.status(500).json((0, response_1.response)(false, 'Internal server error', error));
        }
    }),
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, email, password, name } = req.body;
        try {
            const user = yield UserService_1.UserService.createUser({
                username: username,
                email: email,
                name: name,
                password: password
            });
            const token = (0, jwtHelper_1.generateToken)({
                userId: user.id.toString(),
                email: user.email,
                name: user.username
            });
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, sameSite: true });
            res.status(200).json((0, response_1.response)(true, 'Register successful', { token: token }));
        }
        catch (error) {
            console.error('Error creating user', error);
            if (error instanceof Error) {
                res.status(400).json((0, response_1.response)(false, error.message, error));
            }
            else {
                res.status(500).json((0, response_1.response)(false, 'Internal server error', error));
            }
        }
    }),
    logout: (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.clearCookie('jwt', { httpOnly: true, sameSite: true });
            res.status(200).json((0, response_1.response)(true, 'Logout successful'));
        }
        catch (error) {
            res.status(500).json((0, response_1.response)(false, 'Internal server error', error));
        }
    }),
    verify: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                res.status(401).json((0, response_1.response)(false, 'Unauthenticated'));
                return;
            }
            const userData = yield UserService_1.UserService.userProfile({ id: BigInt(req.user.userId) });
            if (userData) {
                res.status(200).json((0, response_1.response)(true, 'Authenticated', userData));
            }
            else {
                res.status(401).json((0, response_1.response)(false, "Unauthenticated"));
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json((0, response_1.response)(false, "Internal server error"));
        }
    })
};
//# sourceMappingURL=UserController.js.map