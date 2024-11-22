import validator from 'validator';
import xss from 'xss';

import * as UserModel from '../model/User';
import bcrypt from 'bcrypt';

import { prisma } from '../db';
import { User } from '@prisma/client';

import fs from 'fs';
import path from 'path';
import { createImageFile, deleteFile } from '../utils/file';

export const UserService = {
    createUser: async (data: UserModel.UserCreate) => {
        try {
            if (!data.email || !data.username || !data.password) throw new Error('Missing required value for registration');
            if (!validator.isEmail(data.email)) {
                throw new Error('Invalid email address');
            }
            const existed = await prisma.user.findUnique({
                where: { email: data.email }
            });
            if (existed) {
                throw new Error('Email has been used');
            }
            const username = xss(data.username);
            const password = xss(data.password);
            const password_hash = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    username: username,
                    email: data.email,
                    password_hash: password_hash,
                    profile: {
                        create: {
                            name: data.name,
                            description: ''
                        }
                    }
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
            // validate the email
            if (data.email && !validator.isEmail(data.email)) {
                throw new Error('Invalid email');
            }

            // check if the email has been used by other user
            if (data.email) {
                const existedEmail = await prisma.user.findUnique({
                    where: {
                        email: data.email
                    }
                });
                if (existedEmail && existedEmail.id !== data.id) {
                    throw new Error('Email has been used.');
                }
            }

            // if the photo url is included, check the valid extension type 
            if (data.profile_photo) {
                const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                if (!allowedImageTypes.includes(data.profile_photo.mimetype)) {
                    throw new Error('Profile photo must be an image (JPEG, PNG, or JPG)');
                }
            }

            // sanitize the name, and description
            const name = data.name && xss(data.name);
            const description = data.description && xss(data.description);

            // checking for the current user
            const user = await prisma.user.findUnique({
                where: { id: data.id },
                include: { profile: true }
            });

            if (!user) {
                throw new Error('User not found');
            }

            let filename: string | undefined = undefined;

            if (data.profile_photo) {
                const mimeToExtension: Record<string, string> = {
                    'image/jpeg': '.jpeg',
                    'image/png': '.png',
                    'image/jpg': '.jpg'
                };
                const fileExtension = mimeToExtension[data.profile_photo.mimetype];
                filename = `profile-${data.id.toString()}${fileExtension}`;

                if (user.profile?.photo_url) {
                    const oldFileName = path.basename(user.profile.photo_url);
                    await deleteFile(oldFileName);
                }

                const fileBuffer = await data.profile_photo.buffer;
                await createImageFile(filename, Buffer.from(fileBuffer));
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    email: data.email,
                    updated_at: new Date(),
                    profile: {
                        update: {
                            name: name,
                            description: description,
                            photo_url: filename
                        }
                    }
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

}