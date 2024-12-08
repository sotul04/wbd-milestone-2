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
exports.UserService = void 0;
const validator_1 = __importDefault(require("validator"));
const xss_1 = __importDefault(require("xss"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db");
const path_1 = __importDefault(require("path"));
const file_1 = require("../utils/file");
exports.UserService = {
    createUser: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!data.email || !data.username || !data.password || !data.name)
                throw new Error('Missing required value for registration');
            if (!validator_1.default.isEmail(data.email)) {
                throw new Error('Invalid email address');
            }
            const username = (0, xss_1.default)(data.username);
            const password = (0, xss_1.default)(data.password);
            const existedUsername = yield db_1.prisma.user.findUnique({
                where: {
                    username: username
                }
            });
            if (existedUsername) {
                throw new Error('Username has been used');
            }
            const existedEmail = yield db_1.prisma.user.findUnique({
                where: {
                    email: data.email
                }
            });
            if (existedEmail) {
                throw new Error('Email has been used');
            }
            const password_hash = yield bcrypt_1.default.hash(password, 10);
            const newUser = yield db_1.prisma.user.create({
                data: {
                    username: username,
                    email: data.email,
                    password_hash: password_hash,
                    full_name: (0, xss_1.default)(data.name),
                    work_history: '',
                    updated_at: new Date(),
                    skills: '',
                    profile_photo_path: '',
                }
            });
            return newUser;
        }
        catch (error) {
            console.error('Error creating user', error);
            throw error;
        }
    }),
    updateUser: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (data.username) {
                const existed = yield db_1.prisma.user.findUnique({
                    where: {
                        username: data.username
                    }
                });
                if (existed && existed.id !== data.id) {
                    throw new Error('Username has been used by another user');
                }
            }
            if (data.profile_photo && !data.delete_photo) {
                const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                if (!allowedImageTypes.includes(data.profile_photo.mimetype)) {
                    throw new Error('Profile photo must be an image (JPEG, PNG, or JPG)');
                }
            }
            const name = data.name && (0, xss_1.default)(data.name.trim());
            const skills = data.skills && (0, xss_1.default)(data.skills);
            const work_history = data.work_history && (0, xss_1.default)(data.work_history);
            const user = yield db_1.prisma.user.findUnique({
                where: { id: data.id }
            });
            if (!user) {
                throw new Error('User not found');
            }
            let filename = undefined;
            if (data.profile_photo && !data.delete_photo) {
                const mimeToExtension = {
                    'image/jpeg': '.jpeg',
                    'image/png': '.png',
                    'image/jpg': '.jpg'
                };
                const fileExtension = mimeToExtension[data.profile_photo.mimetype];
                const timestamp = Date.now();
                filename = `profile-${data.id.toString()}-${timestamp}${fileExtension}`;
                if (user.profile_photo_path) {
                    const oldFileName = path_1.default.basename(user.profile_photo_path);
                    yield (0, file_1.deleteFile)(oldFileName);
                }
                const fileBuffer = data.profile_photo.buffer;
                yield (0, file_1.createImageFile)(filename, Buffer.from(fileBuffer));
            }
            else if (data.delete_photo) {
                if (user.profile_photo_path) {
                    const oldFileName = path_1.default.basename(user.profile_photo_path);
                    yield (0, file_1.deleteFile)(oldFileName);
                }
            }
            const updatedUser = yield db_1.prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    full_name: name,
                    work_history: work_history,
                    username: data.username,
                    skills: skills,
                    updated_at: new Date(),
                    profile_photo_path: data.delete_photo ? '' : filename
                }
            });
            if (updatedUser)
                return true;
            throw new Error('Failed to update the user');
        }
        catch (error) {
            throw error;
        }
    }),
    authLogin: (authData, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validpass = yield bcrypt_1.default.compare(authData.password, user.password_hash);
            return validpass;
        }
        catch (error) {
            console.error("Error to check auth.", error);
            return false;
        }
    }),
    getUser: (data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_1.prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.username },
                    { username: data.username }
                ]
            }
        });
    }),
    userProfile: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield db_1.prisma.user.findUnique({
            where: {
                id: data.id
            },
            select: {
                id: true,
                username: true,
                email: true,
                full_name: true,
                profile_photo_path: true
            }
        });
        return Object.assign(Object.assign({}, user), { id: user === null || user === void 0 ? void 0 : user.id.toString() });
    })
};
//# sourceMappingURL=UserService.js.map