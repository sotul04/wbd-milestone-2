import { Request, Response } from "express";
import { response } from '../utils/response';

import multer from "multer";

import { UserService } from "../services/UserService";
import { ProfileService } from "../services/ProfileService";
import { GenerateTokenPayload } from "../types/express";
import { UserUpdate, userUpdateSchema } from "../model/User";
import xss from "xss";
import { verifyToken } from "../utils/jwtHelper";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
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

            const updateData = userUpdateSchema.parse(req.body);
            
            if (!req.user || req.user.userId !== userId) {
                res.status(401).json(response(false, 'Unauthorized', null));
                return;
            }

            const data: UserUpdate = {
                id: BigInt(userId),
                name: updateData.name && xss(updateData.name),
                username: updateData.username && xss(updateData.username),
                profile_photo: req.file,
                skills: updateData.skills && xss(updateData.skills),
                work_history: updateData.work_history && xss(updateData.work_history),
                delete_photo: updateData.profile_photo === null
            };

            const result = await UserService.updateUser(data);

            if (result) {
                res.status(200).json(response(true, 'User profile updated successfully'));
            } else {
                res.status(500).json(response(false, 'Failed to update the user'));
            }

        } catch (error) {
            console.error('Error in profilUpdate:', error);
            if (error instanceof Error) {
                res.status(400).json(response(false, error.message, error));
                return;
            }
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
                const profile = await ProfileService.publicAccess({id: BigInt(userId)});
                if (!profile) {
                    res.status(404).json(response(false, 'User not found', null));
                    return;
                }
                res.status(200).json(response(true, 'Succesfully retrieved user data', profile));
                return;
            }
            
            const decoded = verifyToken(token) as GenerateTokenPayload;
            
            if (typeof decoded.userId !== 'string') {
                const profile = await ProfileService.publicAccess({id: BigInt(userId)});
                if (!profile) {
                    res.status(404).json(response(false, 'User not found', null));
                    return;
                }
                res.status(200).json(response(true, 'Succesfully retrieved user data', profile));
                return;
            }
            
            if (userId === decoded.userId) {
                const profile = await ProfileService.selfAccess({id: BigInt(userId)});
                if (!profile) {
                    res.status(404).json(response(false, 'User not found'));
                    return;
                }
                res.status(200).json(response(true, 'Succesfully retrieved user data', profile));
                return;
            }
            
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