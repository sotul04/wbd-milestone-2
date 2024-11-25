import validator from 'validator';
import xss from 'xss';

import * as UserModel from '../model/User';
import bcrypt from 'bcrypt';

import { prisma } from '../db';
import { User } from '@prisma/client';

import path from 'path';
import { createImageFile, deleteFile } from '../utils/file';

export const UserService = {
    createUser: async (data: UserModel.UserCreate) => {
        try {
            if (!data.email || !data.username || !data.password || !data.name) throw new Error('Missing required value for registration');
            if (!validator.isEmail(data.email)) {
                throw new Error('Invalid email address');
            }
            const username = xss(data.username);
            const password = xss(data.password);
            const existedUsername = await prisma.user.findUnique({
                where: {
                    username: username
                }
            });
            if (existedUsername) {
                throw new Error('Username has been used');
            }

            const existedEmail = await prisma.user.findUnique({
                where: {
                    email: data.email
                }
            })
            if (existedEmail) {
                throw new Error('Email has been used');
            }
            const password_hash = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    username: username,
                    email: data.email,
                    password_hash: password_hash,
                    full_name: xss(data.name),
                    work_history: '',
                    skills: '',
                    profile_photo_path: '',
                }
            });
            return newUser;
        } catch (error) {
            console.error('Error creating user', error);
            throw error;
        }
    },
    updateUser: async (data: UserModel.UserUpdate) => {
        try {

            if (data.username) {
                const existed = await prisma.user.findUnique({
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

            const name = data.name && xss(data.name.trim());
            const skills = data.skills && xss(data.skills);
            const work_history = data.work_history && xss(data.work_history);

            const user = await prisma.user.findUnique({
                where: { id: data.id }
            });

            if (!user) {
                throw new Error('User not found');
            }

            let filename: string | undefined | null = undefined;

            if (data.profile_photo && !data.delete_photo) {
                const mimeToExtension: Record<string, string> = {
                    'image/jpeg': '.jpeg',
                    'image/png': '.png',
                    'image/jpg': '.jpg'
                };
                const fileExtension = mimeToExtension[data.profile_photo.mimetype];
                const timestamp = Date.now()
                filename = `profile-${data.id.toString()}-${timestamp}${fileExtension}`;

                if (user.profile_photo_path) {
                    const oldFileName = path.basename(user.profile_photo_path);
                    await deleteFile(oldFileName);
                }

                const fileBuffer = data.profile_photo.buffer;
                await createImageFile(filename, Buffer.from(fileBuffer));
            } else if (data.delete_photo) {
                if (user.profile_photo_path) {
                    const oldFileName = path.basename(user.profile_photo_path);
                    await deleteFile(oldFileName);
                }
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    full_name: name,
                    work_history: work_history,
                    username: data.username,
                    skills: skills,
                    updated_at: new Date(),
                    profile_photo_path: data.delete_photo ? '': filename
                }
            });
            if (updatedUser) return true;
            throw new Error('Failed to update the user');
        } catch (error) {
            throw error;
        }
    },
    authLogin: async (authData: UserModel.UserAuth, user: User) => {
        try {
            const validpass = await bcrypt.compare(authData.password, user.password_hash);
            return validpass;
        } catch (error) {
            console.error("Error to check auth.", error);
            return false;
        }
    },
    getUser: async (data: UserModel.UserAuth) => {
        return await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.username },
                    { username: data.username }
                ]
            }
        })
    },
    userProfile: async (data: UserModel.UserFindId) => {
        const user =  await prisma.user.findUnique({
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
        return {
            ...user,
            id: user?.id.toString()
        }
    }

}