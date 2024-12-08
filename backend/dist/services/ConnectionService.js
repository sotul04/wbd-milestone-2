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
exports.ConnectionService = void 0;
const db_1 = require("../db");
const ChatService_1 = require("./ChatService");
exports.ConnectionService = {
    getUsers: (param) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (param.id) {
                const id = BigInt(param.id);
                const users = yield db_1.prisma.user.findMany({
                    where: param.search ? {
                        OR: [
                            { username: { contains: param.search, mode: 'insensitive' } },
                            { full_name: { contains: param.search, mode: 'insensitive' } }
                        ],
                    } : {},
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        profile_photo_path: true,
                    },
                    take: 20,
                    orderBy: {
                        created_at: 'desc'
                    }
                });
                const user = yield db_1.prisma.user.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        id: true,
                        received_connections: {
                            select: {
                                from_id: true
                            }
                        },
                        sent_connection_requests: {
                            select: {
                                to_id: true
                            }
                        }
                    }
                });
                if (user) {
                    let filtered = users.map(item => {
                        return Object.assign(Object.assign({}, item), { id: item.id.toString(), can_connect: user.received_connections.reduce((acc, val) => acc && val.from_id !== item.id, true) && id !== item.id });
                    });
                    filtered = filtered.map(item => {
                        if (!item.can_connect)
                            return item;
                        return Object.assign(Object.assign({}, item), { can_connect: user.sent_connection_requests.reduce((acc, val) => acc && val.to_id !== BigInt(item.id), true) });
                    });
                    return filtered;
                }
                else {
                    return users.map(user => {
                        return Object.assign(Object.assign({}, user), { id: user.id.toString(), can_connect: false });
                    });
                }
            }
            else {
                const users = yield db_1.prisma.user.findMany({
                    where: param.search ? {
                        OR: [
                            { username: { contains: param.search, mode: 'insensitive' } },
                            { full_name: { contains: param.search, mode: 'insensitive' } }
                        ],
                    } : {},
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        profile_photo_path: true,
                    },
                    take: 20,
                    orderBy: {
                        created_at: 'desc'
                    }
                });
                return users.map(user => {
                    return Object.assign(Object.assign({}, user), { id: user.id.toString(), can_connect: false });
                });
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    connectionSend: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hasConnected = yield db_1.prisma.connection.findUnique({
                where: {
                    from_id_to_id: {
                        from_id: data.from,
                        to_id: data.to
                    }
                }
            });
            if (hasConnected) {
                throw new Error('Users are already connected');
            }
            const existingRequest = yield db_1.prisma.connectionRequest.findUnique({
                where: {
                    from_id_to_id: {
                        from_id: data.from,
                        to_id: data.to
                    }
                }
            });
            if (existingRequest) {
                throw new Error('Connection request already sent');
            }
            const requestBack = yield db_1.prisma.connectionRequest.findUnique({
                where: {
                    from_id_to_id: {
                        from_id: data.to,
                        to_id: data.from
                    }
                }
            });
            if (requestBack) {
                const deleteReq = yield db_1.prisma.connectionRequest.delete({
                    where: {
                        from_id_to_id: {
                            from_id: requestBack.from_id,
                            to_id: requestBack.to_id
                        }
                    }
                });
                if (!deleteReq) {
                    throw new Error('Failed to delete the connection Request');
                }
                yield db_1.prisma.connection.createMany({
                    data: [
                        {
                            from_id: data.from,
                            to_id: data.to,
                            created_at: new Date()
                        },
                        {
                            from_id: data.to,
                            to_id: data.from,
                            created_at: new Date()
                        }
                    ],
                });
                yield ChatService_1.ChatService.createRoom({ first_user_id: data.from, second_user_id: data.to });
                return 'You are now connected';
            }
            else {
                yield db_1.prisma.connectionRequest.create({
                    data: {
                        from_id: data.from,
                        to_id: data.to,
                        created_at: new Date(),
                    }
                });
                return 'Connection request successfully created';
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    connectionDelete: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conn = yield db_1.prisma.connection.findUnique({
                where: {
                    from_id_to_id: {
                        from_id: data.from,
                        to_id: data.to
                    }
                }
            });
            if (!conn) {
                throw new Error('Connection does not exist');
            }
            yield db_1.prisma.connection.deleteMany({
                where: {
                    OR: [
                        {
                            from_id: data.from,
                            to_id: data.to
                        },
                        {
                            from_id: data.to,
                            to_id: data.from
                        }
                    ]
                }
            });
            yield db_1.prisma.roomChat.deleteMany({
                where: {
                    OR: [
                        {
                            first_user_id: data.from,
                            second_user_id: data.to
                        },
                        {
                            second_user_id: data.from,
                            first_user_id: data.to
                        }
                    ]
                }
            });
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    connectionConnect: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = yield db_1.prisma.connectionRequest.findUnique({
                where: {
                    from_id_to_id: {
                        from_id: data.to,
                        to_id: data.from
                    }
                }
            });
            if (!request) {
                throw new Error(`The connection request from id ${data.to} to id ${data.from} does not exist`);
            }
            const deleteReq = yield db_1.prisma.connectionRequest.delete({
                where: {
                    from_id_to_id: {
                        from_id: request.from_id,
                        to_id: request.to_id
                    }
                }
            });
            if (!deleteReq) {
                throw new Error('Failed to delete the connection Request');
            }
            if (data.accept) {
                yield db_1.prisma.connection.createMany({
                    data: [
                        {
                            from_id: data.from,
                            to_id: data.to,
                            created_at: new Date()
                        },
                        {
                            from_id: data.to,
                            to_id: data.from,
                            created_at: new Date()
                        }
                    ],
                });
                yield ChatService_1.ChatService.createRoom({ first_user_id: data.from, second_user_id: data.to });
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    connectionRequests: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const requests = yield db_1.prisma.connectionRequest.findMany({
                where: {
                    to_id: data.id,
                },
                include: {
                    from_user: {
                        select: {
                            username: true,
                            email: true,
                            profile_photo_path: true,
                            full_name: true
                        }
                    },
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
            return requests.map(req => {
                return Object.assign(Object.assign({}, req), { from_id: req.from_id.toString(), to_id: req.to_id.toString() });
            });
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }),
    connectionList: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield db_1.prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });
            if (!user) {
                throw new Error('User not found.');
            }
            const list = yield db_1.prisma.user.findMany({
                where: {
                    sent_connections: {
                        some: {
                            to_id: data.id
                        }
                    }
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profile_photo_path: true,
                    full_name: true
                }
            });
            return list.map(item => {
                return Object.assign(Object.assign({}, item), { id: item.id.toString() });
            });
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    })
};
//# sourceMappingURL=ConnectionService.js.map