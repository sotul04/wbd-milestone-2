import validator from 'validator';
import xss from 'xss';

import * as UserModel from '../model/User';
import bcrypt from 'bcrypt';

import { prisma } from '../db';
import { User } from '@prisma/client';

export const ProfileService = {
    publicAccess: async (data: UserModel.UserFindId): Promise<UserModel.UserProfile | null> => {
        try {
            const profile = await prisma.profile.findUnique({
                where: {
                    id: data.id
                },
                include: {
                    user: {
                        include: {
                            sent_connections: true,
                            received_connections: true
                        }
                    }
                }
            });
            if (!profile) {
                return null;
            } 

            const connection_count = Math.min(profile.user.sent_connections.length, profile.user.received_connections.length);

            return {
                name: profile.name,
                profile_photo: profile.photo_url,
                description: profile.description,
                connection_count
            }

        } catch (error) {
            console.error('Failed to get the user profile data', error);
            return null;
        }
    },

    authenticatedAccess: async (data: UserModel.UserFindConnection): Promise<UserModel.UserProfile | null> => {
        try {
            const profile = await prisma.profile.findUnique({
                where: {
                    id: data.idTarget
                },
                include: {
                    user: {
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
                    }
                }
            });
            if (!profile) {
                return null;
            } 

            const connection_count = Math.min(profile.user.sent_connections.length, profile.user.received_connections.length);
            const connect_status = profile.user.sent_connections.find(connection => connection.to_id === data.idClient) ? true : false;

            return {
                name: profile.name,
                profile_photo: profile.photo_url,
                description: profile.description,
                connection_count,
                experiences: profile.experiences,
                connect_status,
                relevant_posts: connect_status ? profile.user.feeds.map(item => {
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
            const profile = await prisma.profile.findUnique({
                where: {
                    id: data.id
                },
                include: {
                    user: {
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
                    }
                }
            });
            if (!profile) {
                return null;
            } 

            const connection_count = Math.min(profile.user.sent_connections.length, profile.user.received_connections.length);

            return {
                name: profile.name,
                description: profile.description,
                profile_photo: profile.photo_url,
                relevant_posts: profile.user.feeds.map(item => {
                    return {
                        ...item,
                        id: item.id.toString(),
                        user_id: item.user_id.toString()
                    }
                }),
                connection_count,
                experiences: profile.experiences,
                skills: profile.skills,
            }

        } catch (error) {
            console.error('Failed to get the user profile data', error);
            return null;
        }
    }
}