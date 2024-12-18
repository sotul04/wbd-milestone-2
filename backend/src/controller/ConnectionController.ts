import { Request, Response } from "express";
import { response } from '../utils/response';

import { ConnectionService } from "../services/ConnectionService";
import { StatusCodes } from 'http-status-codes';
import { connectionConnectSchema, connectionDeleteParams, connectionListParams, connectionSendSchema, usersGetQuery } from "../model/Connection";
import { verifyToken } from "../utils/jwtHelper";
import { GenerateTokenPayload } from "../types/express";
import { UserFindIdParams } from "../model/User";

export const ConnectionController = {
    getUsers: async (req: Request, res: Response) => {
        try {
            const token = req.cookies.jwt ?? req.headers.authorization?.split(' ')[1];
            const decoded = token && verifyToken(token) as GenerateTokenPayload;
            const { search } = usersGetQuery.parse(req.query);
            const userSearch = typeof search === 'string' ? search : undefined;
            const users = await ConnectionService.getUsers({ search: userSearch, id: decoded?.userId });
            res.status(200).json(response(true, 'Successfully retrieved the data', users));
        } catch (error) {
            console.error(error);
            res.status(500).json(response(false, 'Internal server error', error));
        }
    },

    connectionSend: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json(response(false, 'Unauthorized access'));
                return;
            }
            const { to } = connectionSendSchema.parse(req.body);
            if (to === BigInt(req.user.userId)) {
                res.status(StatusCodes.BAD_REQUEST).json(response(false, 'User ID is invalid'));
                return;
            }
            const message = await ConnectionService.connectionSend({ from: BigInt(req.user.userId), to });
            res.status(200).json(response(true, message));
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(response(false, error.message, error));
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, 'Internal server error', error));
        }
    },

    connectionDelete: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json(response(false, 'Unauthorized access'));
                return;
            }
            const { to } = connectionDeleteParams.parse(req.params);
            await ConnectionService.connectionDelete({ from: BigInt(req.user.userId), to });
            res.status(StatusCodes.OK).json(response(true, 'Connection deleted successfully'));
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(response(false, error.message, error));
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, 'Internal server error', error));
        }
    },

    connectionConnect: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json(response(false, 'Unauthorized access'));
                return;
            }
            const data = connectionConnectSchema.parse(req.body);
            await ConnectionService.connectionConnect({from: BigInt(req.user.userId), to: BigInt(data.to), accept: Boolean(data.accept)});
            res.status(StatusCodes.OK).json(response(true, `Successfully ${data.accept ? 'accepted' : 'rejected'} the request`));
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(response(false, error.message, error));
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, 'Internal server error', error));
        }
    },

    connectionRequests: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(401).json(response(false, 'Unauthorized access'));
                return;
            }
            const requests = await ConnectionService.connectionRequests({id: BigInt(req.user.userId)});
            res.status(StatusCodes.OK).json(response(true, 'Successfully retrieved the data', requests));
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, 'Internal server error', error));
        }
    },

    connectionList: async (req: Request, res: Response) => {
        try {
            const data = connectionListParams.parse(req.params);
            const users = await ConnectionService.connectionList({id: data.userId});
            res.status(StatusCodes.OK).json(response(true, 'Successfully retrieved the data', users));
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(response(false, error.message, error));
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, 'Internal server error', error));
        }
    },

    getRecommendations: async (req: Request, res: Response) => {
        try {
            const id = req.user!.userId;
            const recs = await ConnectionService.getRecommendations({id: BigInt(id)});

            res.status(200).json(response(true, "Recommendation successfully retrieved", recs));
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(response(false, error.message, error));
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response(false, 'Internal server error', error));
        }
    },

}