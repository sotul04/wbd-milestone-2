import { Router } from "express";
import multer from "multer";
import { authJWT } from "../middleware/auth";

import { UserController } from "../controller/UserController";
import { ProfileController, upload } from "../controller/ProfileController";
import { ConnectionController } from "../controller/ConnectionController";

import { validateRequestBody, validateRequestParams, validateQueryParams } from "../middleware/validation";
import { userAuthSchema, userCreateSchema, userUpdateParams, userUpdateSchema } from "../model/User";
import { connectionConnectSchema, connectionDeleteParams, connectionListParams, connectionSendSchema, usersGetQuery } from "../model/Connection";

const uploads = multer();

const router: Router = Router();

// user route
router.post('/login', uploads.none(), validateRequestBody(userAuthSchema), UserController.login);
router.post('/register', uploads.none(), validateRequestBody(userCreateSchema), UserController.register);

// profile routes
router.get('/profile/:userId', ProfileController.getProfile); 
router.put('/profile/:userId', authJWT, upload.single('profile_photo'), validateRequestParams(userUpdateParams), validateRequestBody(userUpdateSchema), ProfileController.profilUpdate);

// connection routes
router.get('/connection', validateQueryParams(usersGetQuery), ConnectionController.getUsers);
router.post('/connection/send', authJWT, uploads.none(), validateRequestBody(connectionSendSchema), ConnectionController.connectionSend);
router.get('/connection/requests', authJWT, ConnectionController.connectionRequests);
router.post('/connection/connect', authJWT, uploads.none(), validateRequestBody(connectionConnectSchema), ConnectionController.connectionConnect);
router.get('/connection/list/:userId', validateQueryParams(connectionListParams), ConnectionController.connectionList);
router.get('/connection/delete/:to', authJWT, validateQueryParams(connectionDeleteParams), ConnectionController.connectionDelete);

export default router;