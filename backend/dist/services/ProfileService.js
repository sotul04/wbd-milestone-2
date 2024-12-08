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
exports.ProfileService = void 0;
const db_1 = require("../db");
exports.ProfileService = {
    publicAccess: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const profile = yield db_1.prisma.user.findUnique({
                where: {
                    id: data.id
                },
                include: {
                    sent_connections: true,
                    received_connections: true
                }
            });
            if (!profile) {
                return null;
            }
            const connection_count = Math.min(profile.sent_connections.length, profile.received_connections.length);
            return {
                name: profile.full_name,
                profile_photo: profile.profile_photo_path,
                username: profile.username,
                connection_count,
                work_history: profile.work_history,
                skills: profile.skills
            };
        }
        catch (error) {
            console.error('Failed to get the user profile data', error);
            return null;
        }
    }),
    authenticatedAccess: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const profile = yield db_1.prisma.user.findUnique({
                where: {
                    id: data.idTarget
                },
                include: {
                    sent_connections: true,
                    received_connections: true,
                    feeds: {
                        take: 10,
                        orderBy: {
                            updated_at: 'desc'
                        }
                    }
                }
            });
            if (!profile) {
                return null;
            }
            const connection_count = Math.min(profile.sent_connections.length, profile.received_connections.length);
            let connect_status = profile.sent_connections.find(connection => connection.to_id === data.idClient) ? 'connected' : 'disconnected';
            const requests = yield db_1.prisma.connectionRequest.findUnique({
                where: {
                    from_id_to_id: {
                        from_id: data.idClient,
                        to_id: data.idTarget
                    }
                }
            });
            if (requests)
                connect_status = 'waiting';
            return {
                name: profile.full_name,
                username: profile.username,
                profile_photo: profile.profile_photo_path,
                connection_count,
                work_history: profile.work_history,
                connect_status,
                relevant_posts: profile.feeds.map(item => {
                    return Object.assign(Object.assign({}, item), { id: item.id.toString(), user_id: item.user_id.toString() });
                }),
                skills: profile.skills
            };
        }
        catch (error) {
            console.error('Failed to get the user profile data', error);
            return null;
        }
    }),
    selfAccess: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const profile = yield db_1.prisma.user.findUnique({
                where: {
                    id: data.id
                },
                include: {
                    sent_connections: true,
                    received_connections: true,
                    feeds: {
                        take: 10,
                        orderBy: {
                            updated_at: 'desc'
                        }
                    }
                }
            });
            if (!profile) {
                return null;
            }
            const connection_count = Math.min(profile.sent_connections.length, profile.received_connections.length);
            return {
                name: profile.full_name,
                username: profile.username,
                profile_photo: profile.profile_photo_path,
                relevant_posts: profile.feeds.map(item => {
                    return Object.assign(Object.assign({}, item), { id: item.id.toString(), user_id: item.user_id.toString() });
                }),
                connection_count,
                work_history: profile.work_history,
                skills: profile.skills,
            };
        }
        catch (error) {
            console.error('Failed to get the user profile data', error);
            return null;
        }
    })
};
//# sourceMappingURL=ProfileService.js.map