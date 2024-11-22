import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { generateToken } from "../utils/jwtHelper";
import { response } from '../utils/response';
import multer from "multer";

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

// export const upload = multer({ dest: "uploads/" });

export const UserController = {
    login: async (req: Request, res: Response) => {
        const { username, password } = req.body;
        try {
            const user = await UserService.getUser({ username, password });
            if (!user) {
                res.status(404).json(response(false, 'User not found', 'Failed to get user'));
                return;
            }
            const isLogin = await UserService.authLogin({ username, password }, user);
            if (!isLogin) {
                res.status(401).json(response(false, 'Password do not match', 'Password comparation failed'));
                return;
            }
            const token = generateToken({
                userId: user.id.toString(),
                email: user.email,
                name: user.username,
                role: 'jobseeker'
            });
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
            res.status(200).json(response(true, 'Login successfull', { token: token }));
        } catch (error) {
            res.status(500).json(response(false, 'Internal server error', error));
        }
    },

    profilUpdate: async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;

            if (!userId) {
                res.status(400).json(response(false, 'ID for user is required', 'User ID required'));
                return;
            }

            const { email, name, description } = req.body;
            console.log("After middleware and multer upload",req.user);
            console.log("Full body", req.body);

            const data = {
                id: BigInt(userId),
                email,
                name,
                description,
                profile_photo: req.file
            };

            const result = await UserService.updateUser(data);

            // Send success response
            if (result) {
                res.status(200).json({ message: 'User profile updated successfully' });
            } else {
                res.status(500).json({ error: 'Failed to update user profile' });
            }

        } catch (error) {
            console.error('Error in profilUpdate:', error);
            res.status(500).json(response(false, 'Internal server error', error));
        }
    },

    register: async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        try {
            const user = await UserService.createUser({
                username,
                email,
                name: username,
                password
            });
            const token = generateToken({
                userId: user.id.toString(),
                email: user.email,
                name: user.username,
                role: 'jobseeker'
            });
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
            res.status(200).json(response(true, 'Login successfull', { token: token }));
        } catch (error) {
            console.error('Error creating user', error);
            if (error instanceof Error) {
                res.status(400).json(response(false, error.message, error));
            } else {
                res.status(500).json(response(false, 'Internal server error', error));
            }
        }
    }
}
