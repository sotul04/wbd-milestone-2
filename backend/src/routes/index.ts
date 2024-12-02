import { Router } from "express";
import multer from "multer";
import { authJWT } from "../middleware/auth";

import { UserController } from "../controller/UserController";
import { ProfileController, upload } from "../controller/ProfileController";
import { ConnectionController } from "../controller/ConnectionController";

import { validateRequestBody, validateRequestParams, validateQueryParams } from "../middleware/validation";
import { getProfileParams, userAuthSchema, userCreateSchema, userUpdateParams, userUpdateSchema } from "../model/User";
import { connectionConnectSchema, connectionDeleteParams, connectionListParams, connectionSendSchema, usersGetQuery } from "../model/Connection";
import { ChatLoadParams, ChatLoadQuery, RoomChatSearchParams } from "../model/Chat";
import { ChatController } from "../controller/ChatController";
import { FeedController } from "../controller/FeedController";
import { FeedCreateSchema, FeedGetQuerySchema, FeedReadSchema, FeedUpdateSchema, getFeedParams } from "../model/Feed";

const uploads = multer();

const router: Router = Router();

// user routes
router.post('/login', uploads.none(), validateRequestBody(userAuthSchema), UserController.login);
router.post('/register', uploads.none(), validateRequestBody(userCreateSchema), UserController.register);
router.get('/verify', authJWT, UserController.verify);
router.get('/logout', UserController.logout);

// profile routes
router.get('/profile/:userId', validateRequestParams(getProfileParams), ProfileController.getProfile);
router.put('/profile/:userId', authJWT, upload.single('profile_photo'), validateRequestParams(userUpdateParams), validateRequestBody(userUpdateSchema), ProfileController.profilUpdate);

// connection routes
router.get('/connection', validateQueryParams(usersGetQuery), ConnectionController.getUsers);
router.post('/connection/send', authJWT, uploads.none(), validateRequestBody(connectionSendSchema), ConnectionController.connectionSend);
router.get('/connection/requests', authJWT, ConnectionController.connectionRequests);
router.post('/connection/connect', authJWT, uploads.none(), validateRequestBody(connectionConnectSchema), ConnectionController.connectionConnect);
router.get('/connection/list/:userId', validateRequestParams(connectionListParams), ConnectionController.connectionList);
router.delete('/connection/delete/:to', authJWT, validateRequestParams(connectionDeleteParams), ConnectionController.connectionDelete);

// chat routes
router.get('/chat/history', authJWT, ChatController.getUserChats);
router.get('/chat/room/:roomId', authJWT, validateRequestParams(ChatLoadParams), validateQueryParams(ChatLoadQuery), ChatController.loadChat);
router.get('/chat/room/users/:roomId', authJWT, validateRequestParams(RoomChatSearchParams), ChatController.roomChatSearch);

// feeds routes
router.get('/feed', validateQueryParams(FeedGetQuerySchema), FeedController.getFeeds);
router.post('/feed', authJWT, uploads.none(), validateRequestBody(FeedCreateSchema), FeedController.createFeed);
router.get('/feed/:id', authJWT, validateRequestParams(FeedReadSchema), FeedController.readFeed),
router.put('/feed/:id', authJWT, validateRequestParams(getFeedParams), validateRequestBody(FeedUpdateSchema), FeedController.updateFeed); 
router.delete('/feed/:id', authJWT, validateRequestParams(getFeedParams), FeedController.deleteFeed);


export default router;