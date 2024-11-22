import { Request, Response } from "express";
import { response } from '../utils/response';
import dotenv from 'dotenv';

import multer from "multer";
import jwt from 'jsonwebtoken';

import { UserService } from "../services/UserService";
import { ProfileService } from "../services/ProfileService";
import { CustomJwtPayload } from "../types/express";

dotenv.config();
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET ?? "secret_key";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedImageTypes.includes(file.mimetype)) {
            const errorResponse = response(false, 'Invalid file type. Only JPEG, PNG, and JPG are allowed.', null);
            cb(new Error(JSON.stringify(errorResponse)));
        }
        cb(null, true);
    }
});

export const ProfileController = {
    profilUpdate: async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;

            if (!userId) {
                res.status(400).json(response(false, 'ID for user is required', 'User ID required'));
                return;
            }

            const { email, name, description, skills, experiences } = req.body;
            
            if (!req.user || req.user.userId !== userId) {
                res.status(401).json(response(false, 'Unauthorized', null));
                return;
            }

            const data = {
                id: BigInt(userId),
                email,
                name,
                description,
                profile_photo: req.file,
                skills,
                experiences
            };

            const result = await UserService.updateUser(data);

            if (result) {
                res.status(200).json(response(true, 'User profile updated successfully'));
            } else {
                res.status(500).json(response(false, 'Failed to update the user'));
            }

        } catch (error) {
            console.error('Error in profilUpdate:', error);
            res.status(500).json(response(false, 'Internal server error', error));
        }
    },

    getProfile: async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;

            if (!userId) {
                res.status(400).json(response(false, 'ID for user is required', 'User ID required'));
                return;
            }

            const token = req.cookies.jwt ?? req.headers.authorization?.split(' ')[1];
            if (!token) {
                console.log('Unauthenticated user access');
                const profile = await ProfileService.publicAccess({id: BigInt(userId)});
                if (!profile) {
                    res.status(404).json(response(false, 'User not found', null));
                    return;
                }
                res.status(200).json(response(true, 'Succesfully retrieved user data', profile));
                return;
            }
            
            const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
            
            if (typeof decoded.userId !== 'string') {
                console.log('Unauthenticated user access');
                const profile = await ProfileService.publicAccess({id: BigInt(userId)});
                if (!profile) {
                    res.status(404).json(response(false, 'User not found', null));
                    return;
                }
                res.status(200).json(response(true, 'Succesfully retrieved user data', profile));
                return;
            }
            
            if (userId === decoded.userId) {
                console.log('Owner access');
                const profile = await ProfileService.selfAccess({id: BigInt(userId)});
                if (!profile) {
                    console.log("USER ID:",userId);
                    res.status(404).json(response(false, 'User not found'));
                    return;
                }
                res.status(200).json(response(true, 'Succesfully retrieved user data', profile));
                return;
            }
            
            console.log('Authenticated access');
            const profile = await ProfileService.authenticatedAccess({idClient: BigInt(decoded.userId), idTarget: BigInt(userId)});
                if (!profile) {
                    res.status(404).json(response(false, 'User not found'));
                    return;
                }
                res.status(200).json(response(true, 'Succesfully retrieved user data', profile));
                return;

        } catch (error) {
            console.error("Error", error);
            res.status(500).json(response(false, 'Internal server error', error));
        }
    }
}