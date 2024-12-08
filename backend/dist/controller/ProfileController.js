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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = exports.upload = void 0;
const response_1 = require("../utils/response");
const multer_1 = __importDefault(require("multer"));
const UserService_1 = require("../services/UserService");
const ProfileService_1 = require("../services/ProfileService");
const User_1 = require("../model/User");
const xss_1 = __importDefault(require("xss"));
const jwtHelper_1 = require("../utils/jwtHelper");
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedImageTypes.includes(file.mimetype)) {
            const errorResponse = (0, response_1.response)(false, 'Invalid file type. Only JPEG, PNG, and JPG are allowed.', null);
            cb(new Error(JSON.stringify(errorResponse)));
        }
        cb(null, true);
    }
});
exports.ProfileController = {
    profilUpdate: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const updateData = User_1.userUpdateSchema.parse(req.body);
            if (!req.user || req.user.userId !== userId) {
                res.status(401).json((0, response_1.response)(false, 'Unauthorized', null));
                return;
            }
            const data = {
                id: BigInt(userId),
                name: updateData.name && (0, xss_1.default)(updateData.name),
                username: updateData.username && (0, xss_1.default)(updateData.username),
                profile_photo: req.file,
                skills: updateData.skills && (0, xss_1.default)(updateData.skills),
                work_history: updateData.work_history && (0, xss_1.default)(updateData.work_history),
                delete_photo: updateData.profile_photo === null
            };
            const result = yield UserService_1.UserService.updateUser(data);
            if (result) {
                res.status(200).json((0, response_1.response)(true, 'User profile updated successfully'));
            }
            else {
                res.status(500).json((0, response_1.response)(false, 'Failed to update the user'));
            }
        }
        catch (error) {
            console.error('Error in profilUpdate:', error);
            if (error instanceof Error) {
                res.status(400).json((0, response_1.response)(false, error.message, error));
                return;
            }
            res.status(500).json((0, response_1.response)(false, 'Internal server error', error));
        }
    }),
    getProfile: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const userId = req.params.userId;
            if (!userId) {
                res.status(400).json((0, response_1.response)(false, 'ID for user is required', 'User ID required'));
                return;
            }
            const token = (_a = req.cookies.jwt) !== null && _a !== void 0 ? _a : (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            if (!token) {
                const profile = yield ProfileService_1.ProfileService.publicAccess({ id: BigInt(userId) });
                if (!profile) {
                    res.status(404).json((0, response_1.response)(false, 'User not found', null));
                    return;
                }
                res.status(200).json((0, response_1.response)(true, 'Succesfully retrieved user data', profile));
                return;
            }
            const decoded = (0, jwtHelper_1.verifyToken)(token);
            if (typeof decoded.userId !== 'string') {
                const profile = yield ProfileService_1.ProfileService.publicAccess({ id: BigInt(userId) });
                if (!profile) {
                    res.status(404).json((0, response_1.response)(false, 'User not found', null));
                    return;
                }
                res.status(200).json((0, response_1.response)(true, 'Succesfully retrieved user data', profile));
                return;
            }
            if (userId === decoded.userId) {
                const profile = yield ProfileService_1.ProfileService.selfAccess({ id: BigInt(userId) });
                if (!profile) {
                    res.status(404).json((0, response_1.response)(false, 'User not found'));
                    return;
                }
                res.status(200).json((0, response_1.response)(true, 'Succesfully retrieved user data', profile));
                return;
            }
            const profile = yield ProfileService_1.ProfileService.authenticatedAccess({ idClient: BigInt(decoded.userId), idTarget: BigInt(userId) });
            if (!profile) {
                res.status(404).json((0, response_1.response)(false, 'User not found'));
                return;
            }
            res.status(200).json((0, response_1.response)(true, 'Succesfully retrieved user data', profile));
            return;
        }
        catch (error) {
            console.error("Error", error);
            res.status(500).json((0, response_1.response)(false, 'Internal server error', error));
        }
    })
};
//# sourceMappingURL=ProfileController.js.map