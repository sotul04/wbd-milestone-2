import * as ConnectionModel from '../model/Connection';

import { prisma } from '../db';

export const ConnectionService = {
    getUsers: async (param: ConnectionModel.UsersGet) => {
        try {
            const users = await prisma.user.findMany({
                where: param.search ? {
                    OR: [
                        { username: { contains: param.search, mode: 'insensitive' } },
                        {
                            profile: {
                                name: { contains: param.search, mode: 'insensitive' }
                            }
                        }
                    ]
                } : {},
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profile: {
                        select: {
                            name: true,
                            photo_url: true
                        }
                    }
                },
                take: 20,
                orderBy: {
                    created_at: 'desc'
                }
            });

            return users.map(user => {
                return {
                    ...user,
                    id: user.id.toString()
                }
            });
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
                            profile: {
                                select: {
                                    name: true,
                                    photo_url: true
                                }
                            }
                        }
                    },
                },
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
            const user = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });
            if (!user) {
                throw new Error('User not found.');
            }
            const list = await prisma.user.findMany({
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
                    profile: {
                        select: {
                            photo_url: true,
                            name: true,
                        }
                    }
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
    }
}