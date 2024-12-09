import * as ConnectionModel from '../model/Connection';

import { prisma } from '../db';
import { ChatService } from './ChatService';
import { UserFindId } from '../model/User';

export const ConnectionService = {
    getUsers: async (param: ConnectionModel.UsersGet) => {
        try {
            if (param.id) {
                const id = BigInt(param.id);
                const users = await prisma.users.findMany({
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

                const user = await prisma.users.findUnique({
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
                        return {
                            ...item,
                            id: item.id.toString(),
                            can_connect: user.received_connections.reduce((acc, val) => acc && val.from_id !== item.id, true) && id !== item.id
                        }
                    })

                    filtered = filtered.map(item => {
                        if (!item.can_connect) return item;
                        return {
                            ...item,
                            can_connect: user.sent_connection_requests.reduce((acc, val) => acc && val.to_id !== BigInt(item.id), true)
                        }
                    });

                    return filtered;
                } else {
                    return users.map(user => {
                        return {
                            ...user,
                            id: user.id.toString(),
                            can_connect: false
                        }
                    });
                }

            } else {
                const users = await prisma.users.findMany({
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
                    return {
                        ...user,
                        id: user.id.toString(),
                        can_connect: false
                    }
                });
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    connectionSend: async (data: ConnectionModel.ConnectionSend) => {
        try {
            const hasConnected = await prisma.connection.findUnique({
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

            const existingRequest = await prisma.connectionRequest.findUnique({
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

            const requestBack = await prisma.connectionRequest.findUnique({
                where: {
                    from_id_to_id: {
                        from_id: data.to,
                        to_id: data.from
                    }
                }
            });

            if (requestBack) {
                const deleteReq = await prisma.connectionRequest.delete({
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

                await prisma.connection.createMany({
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

                await ChatService.createRoom({ first_user_id: data.from, second_user_id: data.to });

                return 'You are now connected';

            } else {
                await prisma.connectionRequest.create({
                    data: {
                        from_id: data.from,
                        to_id: data.to,
                        created_at: new Date(),
                    }
                });

                return 'Connection request successfully created'
            }


        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    connectionDelete: async (data: ConnectionModel.ConnectionDelete) => {
        try {
            const conn = await prisma.connection.findUnique({
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

            await prisma.connection.deleteMany({
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

            await prisma.roomChat.deleteMany({
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
            })
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    connectionConnect: async (data: ConnectionModel.ConnectionConnect) => {
        try {
            const request = await prisma.connectionRequest.findUnique({
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

            const deleteReq = await prisma.connectionRequest.delete({
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
                await prisma.connection.createMany({
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

                await ChatService.createRoom({ first_user_id: data.from, second_user_id: data.to });
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    connectionRequests: async (data: ConnectionModel.ConnectionRequests) => {
        try {
            const requests = await prisma.connectionRequest.findMany({
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
                return {
                    ...req,
                    from_id: req.from_id.toString(),
                    to_id: req.to_id.toString()
                }
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    connectionList: async (data: ConnectionModel.ConnectionList) => {
        try {
            const user = await prisma.users.findUnique({
                where: {
                    id: data.id
                }
            });
            if (!user) {
                throw new Error('User not found.');
            }
            const list = await prisma.users.findMany({
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
                return {
                    ...item,
                    id: item.id.toString()
                }
            })
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    getRecommendations: async (param: UserFindId) => {
        try {
            const directConnections = await prisma.connection.findMany({
                where: {
                    from_id: param.id
                },
                select: {
                    to_id: true,
                },
            });

            const directIds = new Set(
                directConnections.map((conn) =>
                    conn.to_id
                )
            );

            const directs = Array.from(directIds);

            if (directConnections.length === 0) {
                const fallbackUsers = await prisma.users.findMany({
                    where: {
                        AND: [
                            { NOT: { id: param.id } },
                            {
                                received_connection_requests: {
                                    none: {
                                        from_id: param.id
                                    }
                                }
                            }
                        ],
                    },
                    select: {
                        id: true,
                        full_name: true,
                        profile_photo_path: true,
                        username: true,
                    },
                    take: 10,
                });

                console.log("Last last");

                return fallbackUsers.map(user => ({
                    ...user,
                    id: user.id.toString(),
                }));
            }

            const sentRequest = await prisma.connectionRequest.findMany({
                where: {
                    from_id: param.id
                },
                select: {
                    to_id: true
                }
            });

            const sents = sentRequest.map(item => item.to_id);

            const secondDegreeConnections = await prisma.connection.findMany({
                where: {
                    AND: [
                        { from_id: { in: directs } },
                        {
                            NOT: {
                                OR: [
                                    { to_id: param.id },
                                    { to_id: { in: sents } }
                                ],
                            },
                        },
                    ],
                },
                select: {
                    to_id: true,
                },
            });

            const secondDegreeIds = new Set(
                secondDegreeConnections.map((conn) =>
                    conn.to_id
                )
            );

            const secondDirects = Array.from(secondDegreeIds);

            const thirdDegreeConnections = await prisma.connection.findMany({
                where: {
                    AND: [
                        { from_id: { in: secondDirects } },
                        {
                            NOT: {
                                OR: [
                                    { to_id: param.id },
                                    { to_id: { in: directs } },
                                    { to_id: { in: sents } }
                                ],
                            },
                        },
                    ],
                },
                select: {
                    from_id: true,
                    to_id: true,
                },
            });

            const thirdDegreeIds = new Set(
                thirdDegreeConnections.map((conn) =>
                    secondDegreeIds.has(conn.from_id) ? conn.to_id : conn.from_id
                )
            );

            console.log("3rd", thirdDegreeIds)

            const allRecommendations = new Set([
                ...secondDegreeIds,
                ...thirdDegreeIds,
            ]);

            if (allRecommendations.size === 0) {
                const fallbackUsers = await prisma.users.findMany({
                    where: {
                        AND: [
                            { NOT: { id: { in: [param.id, ...directs], }, }, },
                            {
                                received_connection_requests: {
                                    none: { from_id: param.id }
                                }
                            }
                        ],
                    },
                    select: {
                        id: true,
                        full_name: true,
                        profile_photo_path: true,
                        username: true,
                    },
                    take: 10,
                });

                console.log("Second last");

                return fallbackUsers.map(user => ({
                    ...user,
                    id: user.id.toString(),
                }));
            }

            const recommendedUsers = Array.from(allRecommendations);
            const recs = await prisma.users.findMany({
                where: {
                    id: { in: recommendedUsers },
                    received_connection_requests: {
                        none: {
                            from_id: param.id
                        }
                    }
                },
                select: {
                    id: true,
                    full_name: true,
                    profile_photo_path: true,
                    username: true,
                },
                take: 10,
            });

            console.log("Last");

            return recs.map(user => ({
                ...user,
                id: user.id.toString(),
            }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
}