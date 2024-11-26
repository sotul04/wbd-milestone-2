import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { generateToken } from "../utils/jwtHelper";
import { response } from '../utils/response';

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
                name: user.username
            });
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, sameSite: true });
            res.status(200).json(response(true, 'Login successfull', { token: token }));
        } catch (error) {
            res.status(500).json(response(false, 'Internal server error', error));
        }
    },

    register: async (req: Request, res: Response) => {
        const { username, email, password, name } = req.body;
        try {
            const user = await UserService.createUser({
                username: username,
                email: email,
                name: name,
                password: password
            });
            const token = generateToken({
                userId: user.id.toString(),
                email: user.email,
                name: user.username
            });
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, sameSite: true });
            res.status(200).json(response(true, 'Login successfull', { token: token }));
        } catch (error) {
            console.error('Error creating user', error);
            if (error instanceof Error) {
                res.status(400).json(response(false, error.message, error));
            } else {
                res.status(500).json(response(false, 'Internal server error', error));
            }
        }
    },

    logout: async (_: Request, res: Response) => {
        try {
            res.clearCookie('jwt', { httpOnly: true, sameSite: true });
            res.status(200).json(response(true, 'Logout successful'));
        } catch (error) {
            res.status(500).json(response(false, 'Internal server error', error));
        }
    },

    verify: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(200).json(response(false, 'Unauthenticated'));
                return;
            }
            const userData = await UserService.userProfile({ id: BigInt(req.user.userId) });
            if (userData) {
                res.status(200).json(response(true, 'Authenticated', userData));
            } else {
                res.status(401).json(response(false, "Unauthenticated"));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(response(false, "Internal server error"))
        }
    }
}
