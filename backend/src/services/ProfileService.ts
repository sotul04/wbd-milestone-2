import * as UserModel from '../model/User';

import { prisma } from '../db';

export const ProfileService = {
    publicAccess: async (data: UserModel.UserFindId): Promise<UserModel.UserProfile | null> => {
        try {
            const profile = await prisma.user.findUnique({
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
                connection_count
            }

        } catch (error) {
            console.error('Failed to get the user profile data', error);
            return null;
        }
    },

    authenticatedAccess: async (data: UserModel.UserFindConnection): Promise<UserModel.UserProfile | null> => {
        try {

            const profile = await prisma.user.findUnique({
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

            const requests = await prisma.connectionRequest.findUnique({
                where: {
                    from_id_to_id: {
                        from_id: data.idClient,
                        to_id: data.idTarget
                    }
                }
            });

            if (requests) connect_status = 'waiting';

            return {
                name: profile.full_name,
                username: profile.username,
                profile_photo: profile.profile_photo_path,
                connection_count,
                work_history: profile.work_history,
                connect_status,
                relevant_posts: connect_status === 'connected' ? profile.feeds.map(item => {
                    return {
                        ...item,
                        id: item.id.toString(),
                        user_id: item.user_id.toString()
                    }
                }) : undefined,
                skills: connect_status ? profile.skills : undefined
            }

        } catch (error) {
            console.error('Failed to get the user profile data', error);
            return null;
        }
    },

    selfAccess: async (data: UserModel.UserFindId): Promise<UserModel.UserProfile | null> => {
        try {
            const profile = await prisma.user.findUnique({
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
                    return {
                        ...item,
                        id: item.id.toString(),
                        user_id: item.user_id.toString()
                    }
                }),
                connection_count,
                work_history: profile.work_history,
                skills: profile.skills,
            }

        } catch (error) {
            console.error('Failed to get the user profile data', error);
            return null;
        }
    }
}