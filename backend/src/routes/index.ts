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
import { FeedCreateSchema, FeedDeleteParams, FeedReadParams, FeedUpdateParams, FeedUpdateSchema, GetFeedsQuery } from "../model/Feed";
import { PushChatNotificationSchema, PushFeedNotificationSchema, PushSubsSchema } from "../model/Notification";
import { NotificationController } from "../controller/NotificationController";

const uploads = multer();

const router: Router = Router();

// user routes
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             example:
 *               username: johndoe
 *               password: secret123
 *     responses:
 *       200:
 *         description: Successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token for authentication.
 *               example:
 *                 success: true
 *                 message: "Login successful"
 *                 data:
 *                   token: "eyJhbGciOiJIUzI1..."
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Password does not match"
 *                 error: "Password comparison failed"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "User not found"
 *                 error: "Failed to get user"
 *       500:
 *         description: Internal server error.
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.post('/login', uploads.none(), validateRequestBody(userAuthSchema), UserController.login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: User registration
 *     description: Registers a new user and returns a JWT token.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: created username
 *               email:
 *                 type: string
 *                 description: user's email address
 *               password:
 *                 type: string
 *                 description: created password
 *               name:
 *                 type: string
 *                 description: user's full name
 *             example:
 *               username: johndoe
 *               email: johndoe@example.com
 *               password: secret123
 *               name: John Doe
 *     responses:
 *       200:
 *         description: Successful registration
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data: 
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token for authentication  
 *               example:
 *                 success: true
 *                 message: "Authenticated"
 *                 data:
 *                   token: "eyJhbGciOiJIUzI1..."  
 *       400:
 *         description: Bad request (e.g., missing fields).
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Missing password" 
 *                 error: {}
 *       500:
 *         description: Internal server error.
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 * 
*/
router.post('/register', uploads.none(), validateRequestBody(userCreateSchema), UserController.register);

/**
 * @swagger
 * /verify:
 *   get:
 *     summary: Verify User Authentication
 *     description: Verifies if the user is authenticated by checking the JWT.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User is authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username: 
 *                       type: string
 *                     email: 
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     profile_photo_path:
 *                       type: string
 *               example:
 *                 success: true
 *                 message: "Authenticated"
 *                 data:
 *                   id: "1"
 *                   username: johndoe
 *                   email: johndoe@example.com
 *                   full_name: John Doe
 *                   profile_photo_path: public/profile_pic.png
 *       401:
 *         description: User is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthenticated"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.get('/verify', authJWT, UserController.verify);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: User Logout
 *     description: Logs out the user by clearing the JWT cookie.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successful logout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: true
 *                 message: "Logout successful"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.get('/logout', UserController.logout);

// profile routes
/**
 * @swagger
 * /profile/{userId}:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves profile details of a specific user.
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved user data.
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     username:
 *                       type: string
 *                     work_history:
 *                       type: string
 *                     skills:
 *                       type: string
 *                     profile_photo:
 *                       type: string
 *                     relevant_posts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "12345"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-01T12:00:00Z"
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-02T12:00:00Z"
 *                           content:
 *                             type: string
 *                             example: "This is a sample post content."
 *                           user_id:
 *                             type: string
 *                             example: "67890"
 *                     connection_count:
 *                       type: number
 *                     connect_status:
 *                       type: string
 *       400:
 *         description: User ID is missing in the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: 'ID for user is required'
 *                 error: 'User ID required'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: 'User not found'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.get('/profile/:userId', validateRequestParams(getProfileParams), ProfileController.getProfile);

/**
 * @swagger
 * /profile/{userId}:
 *   put:
 *     summary: Update user profile
 *     description: Updates the profile details of a specific user.
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The full name of the user.
 *               username:
 *                 type: string
 *                 description: The unique username of the user.
 *               profile_photo:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo to be uploaded.
 *               skills:
 *                 type: string
 *                 description: Skills of the user.
 *               work_history:
 *                 type: string
 *                 description: Work history of the user.
 *               delete_photo:
 *                 type: boolean
 *                 description: Set to true to delete the existing profile photo.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: true
 *                 message: "User profile updated successfully"           
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Error in profile update: "
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthorized"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to update the user"
 *                 error: {}
 */
router.put('/profile/:userId', authJWT, upload.single('profile_photo'), validateRequestParams(userUpdateParams), validateRequestBody(userUpdateSchema), ProfileController.profilUpdate);

// connection routes
/**
 * @swagger
 * /connection:
 *   get:
 *     summary: Search users
 *     description: Retrieves a list of users matching the search query.
 *     tags:
 *       - Connections
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         description: Search term for filtering users.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved the data.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "12345"
 *                       can_connect:
 *                         type: boolean
 *                         example: true
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "12345@mail.com"
 *                       full_name:
 *                         type: string
 *                         example: "John Doe"
 *                       profile_photo_path:
 *                         type: string
 *                         example: "public/profile_pic.png"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to update the user"
 *                 error: {}
 */
router.get('/connection', validateQueryParams(usersGetQuery), ConnectionController.getUsers);

/**
 * @swagger
 * /connection/send:
 *   post:
 *     summary: Send connection request
 *     description: Sends a connection request to another user.
 *     tags:
 *       - Connections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: User ID to send a connection request to.
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Connection request sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Connection request sent successfully.
 *       400:
 *         description: Invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthorized access"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthorized access"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to update the user"
 *                 error: {}
 */
router.post('/connection/send', authJWT, uploads.none(), validateRequestBody(connectionSendSchema), ConnectionController.connectionSend);

/**
 * @swagger
 * /connection/requests:
 *   get:
 *     summary: Retrieve connection requests
 *     description: Gets the list of pending connection requests for the authenticated user.
 *     tags:
 *       - Connections
 *     responses:
 *       200:
 *         description: Successfully retrieved the data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved the data.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       from_id:
 *                         type: string
 *                         example: "12345"
 *                       to_id:
 *                         type: string
 *                         example: "23456"
 *                       from_user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             example: johndoe
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: johndoe@gmail.com
 *                           full_name:
 *                             type: string
 *                             example: John Doe
 *                           profile_photo_path:
 *                             type: string
 *                             example: "public/profile_pic.png"
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2023-01-01T12:00:00Z"
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthorized access"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to update the user"
 *                 error: {}
 */
router.get('/connection/requests', authJWT, ConnectionController.connectionRequests);

/**
 * @swagger
 * /connection/connect:
 *   post:
 *     summary: Accept or reject connection request
 *     description: Handles connection requests by accepting or rejecting them.
 *     tags:
 *       - Connections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: The ID of the user who sent the request.
 *                 example: "123"
 *               accept:
 *                 type: boolean
 *                 description: Accept or reject the connection request.
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully handled the connection request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully accepted the request.
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthorized access"
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Invalid syntax"
 *                 error: "Invalid syntax"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to update the user"
 *                 error: {}
 */
router.post('/connection/connect', authJWT, uploads.none(), validateRequestBody(connectionConnectSchema), ConnectionController.connectionConnect);

/**
 * @swagger
 * /connection/list/{userId}:
 *   get:
 *     summary: Retrieve user connections
 *     description: Retrieves a list of connections for a specific user.
 *     tags:
 *       - Connections
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user whose connections are being retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved the data.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "12345"
 *                       can_connect:
 *                         type: boolean
 *                         example: true
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "12345@mail.com"
 *                       full_name:
 *                         type: string
 *                         example: "John Doe"
 *                       profile_photo_path:
 *                         type: string
 *                         example: "public/profile_pic.png"        
 *       400:
 *         description: Bad request (e.g., missing fields).
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Invalid id" 
 *                 error: "Invalid id"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.get('/connection/list/:userId', validateRequestParams(connectionListParams), ConnectionController.connectionList);

/**
 * @swagger
 * /connection/delete/{to}:
 *   delete:
 *     summary: Delete connection
 *     description: Deletes a connection with another user.
 *     tags:
 *       - Connections
 *     parameters:
 *       - in: path
 *         name: to
 *         required: true
 *         description: The ID of the user to disconnect from.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Connection deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Connection deleted successfully.
 *       400:
 *         description: Bad request (e.g., missing fields).
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Invalid id" 
 *                 error: "Invalid id"
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthorized access"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to update the user"
 *                 error: {}
 */
router.delete('/connection/delete/:to', authJWT, validateRequestParams(connectionDeleteParams), ConnectionController.connectionDelete);

// chat routes
/**
 * @swagger
 * /chat/user:
 *   get:
 *     summary: Get user chat rooms
 *     description: Retrieves all chat rooms associated with the authenticated user.
 *     tags:
 *       - Chat
 *     responses:
 *       200:
 *         description: Successfully retrieved the user chat rooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved the user chats.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       first_user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 12345
 *                           full_name:
 *                             type: string
 *                             example: John Done
 *                           profile_photo_path:
 *                             type: string   
 *                             example: "public/profile_pic.png"   
 *                       second_user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 23456
 *                           full_name:
 *                             type: string
 *                             example: Jane Doe
 *                           profile_photo_path:
 *                             type: string
 *                             example: "public/profile_pic_2.png" 
 *                       id:
 *                         type: string
 *                         example: 12345
 *                       last_message:
 *                         type: string
 *                         example: See you tomorrow!
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to update the user"
 *                 error: {}
 */
router.get('/chat/history', authJWT, ChatController.getUserChats);

/**
 * @swagger
 * /chat/{roomId}:
 *   get:
 *     summary: Load chat messages
 *     description: Retrieves chat messages from a specific room, optionally paginated using a cursor.
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the chat room to load messages from.
 *         schema:
 *           type: string
 *       - in: query
 *         name: cursor
 *         required: false
 *         description: The cursor for pagination (optional).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved chat messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Load Chat Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       messages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             from_id:
 *                               type: string
 *                               example: 12345
 *                             to_id:
 *                               type: string
 *                               example: 23456
 *                             message:
 *                               type: string
 *                               example: "Hello, how are you?"
 *                             timestamp:
 *                               type: string
 *                               format: date-time
 *                               example: "2023-01-01T12:00:00Z"
 *                       next_cursor:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-05T12:00:00Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.get('/chat/room/:roomId', authJWT, validateRequestParams(ChatLoadParams), validateQueryParams(ChatLoadQuery), ChatController.loadChat);

/**
 * @swagger
 * /chat/room/{roomId}:
 *   get:
 *     summary: Get chat room details
 *     description: Retrieves details about a specific chat room and its messages.
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the chat room.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved chat room details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved the room data.
 *                 data:
 *                   type: object
 *                   properties:
 *                     first_user_id:
 *                       type: string
 *                       example: "12345"
 *                     second_user_id:
 *                       type: string
 *                       example: "67890"
 *                     first_user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "12345"
 *                         full_name:
 *                           type: string
 *                           example: John Doe
 *                         profile_photo_path:
 *                           type: string
 *                           example: "public/profile_john.png"
 *                     second_user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "67890"
 *                         full_name:
 *                           type: string
 *                           example: Mark Doe
 *                         profile_photo_path:
 *                           type: string
 *                           example: "public/profile_mark.png"
 *       401:
 *         description: Unauthorized access to the chat room.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthorized"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.get('/chat/room/users/:roomId', authJWT, validateRequestParams(RoomChatSearchParams), ChatController.roomChatSearch);

// feeds routes
/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get all feeds
 *     description: Retrieves a paginated list of feeds visible to the authenticated user.
 *     tags:
 *       - Feed
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of feeds to retrieve (default is 10).
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: cursor
 *         required: false
 *         description: The cursor for pagination (optional).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved feeds.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Get Feeds Success.
 *                 data:
 *                   type: object
 *                   properties:
 *                     feeds:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 5
 *                           user_id:
 *                             type: string
 *                             example: 12345
 *                           content:
 *                             type: string
 *                             example: "I'm proud to announce that I'll be graduating tomorrow"
 *                           user:
 *                             type: object
 *                             properties:
 *                               full_name:
 *                                 type: string
 *                                 example: John Doe
 *                               profile_photo_path:
 *                                 type: string
 *                                 example: "public/profile_john.png"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-01T12:00:00Z"
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-03T12:50:00Z"
 *                     nextCursor:
 *                       type: string
 *                       example: 20
 *                     cursor:
 *                       type: string
 *                       example: 10
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.get('/feed', authJWT, validateQueryParams(GetFeedsQuery), FeedController.getFeeds);

/**
 * @swagger
 * /feed:
 *   post:
 *     summary: Create a new feed
 *     description: Allows the authenticated user to create a new feed post.
 *     tags:
 *       - Feed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the feed post.
 *                 example: "This is a new feed post!"
 *     responses:
 *       200:
 *         description: Successfully created feed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully created feed.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 10
 *                     user_id:
 *                       type: string
 *                       example: 23456
 *                     content:
 *                       type: string
 *                       example: Coding is so fun!
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T12:00:00Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-03T12:50:00Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.post('/feed', authJWT, uploads.none(), validateRequestBody(FeedCreateSchema), FeedController.createFeed);

/**
 * @swagger
 * /feed/{id}:
 *   get:
 *     summary: Get a specific feed
 *     description: Retrieves details of a specific feed post by its ID.
 *     tags:
 *       - Feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the feed to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the feed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved the Feed.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 12
 *                     user_id:
 *                       type: string
 *                       example: 12345
 *                     content:
 *                       type: string
 *                       example: "Halo, haloo!"
 *                     user:
 *                       type: object
 *                       properties:
 *                         full_name:
 *                           type: string
 *                           example: John Doe
 *                         profile_photo_path:
 *                           type: string
 *                           example: "public/profile_john.png"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T12:00:00Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-03T12:50:00Z"
 *       404:
 *         description: Feed not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Feed not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.get('/feed/:id', authJWT, validateRequestParams(FeedReadParams), FeedController.readFeed);

/**
 * @swagger
 * /feed/{id}:
 *   patch:
 *     summary: Update a feed
 *     description: Allows the authenticated user to update the content of a feed post they own.
 *     tags:
 *       - Feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the feed to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the feed post.
 *                 example: "This is the updated feed post!"
 *     responses:
 *       200:
 *         description: Successfully updated the feed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Update Feed Success.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     user_id:
 *                       type: string
 *                       example: "67890"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T12:00:00Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-02T12:00:00Z"
 *                     content:
 *                       type: string
 *                       example: "This is a sample post content."
 *       401:
 *         description: Unauthorized to update the feed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthorized"
 *       404:
 *         description: Feed not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Feed not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to update the user"
 *                 error: {}
 */
router.put('/feed/:id', authJWT, uploads.none(), validateRequestParams(FeedUpdateParams), validateRequestBody(FeedUpdateSchema), FeedController.updateFeed); 

/**
 * @swagger
 * /feed/{id}:
 *   delete:
 *     summary: Delete a feed
 *     description: Allows the authenticated user to delete a feed post they own.
 *     tags:
 *       - Feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the feed to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the feed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully deleted the feed.
 *       401:
 *         description: Unauthorized to delete the feed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Unauthorized"
 *       404:
 *         description: Feed not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: "Feed is not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Internal server error"
 *                 error: {}
 */
router.delete('/feed/:id', authJWT, validateRequestParams(FeedDeleteParams), FeedController.deleteFeed);

// push notification
/**
 * @swagger
 * /notifications/subscribe:
 *   post:
 *     summary: Subscribe to notifications
 *     description: Subscribes a user to push notifications by adding their subscription details.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: bigint
 *                 description: The ID of the user subscribing to notifications.
 *                 example: 123456789
 *               endpoint:
 *                 type: string
 *                 description: The endpoint for the push subscription.
 *                 example: "https://fcm.googleapis.com/fcm/send/abc123..."
 *               keys:
 *                 type: object
 *                 properties:
 *                   auth:
 *                     type: string
 *                     description: Auth key for the subscription.
 *                     example: "abcd1234..."
 *                   p256dh:
 *                     type: string
 *                     description: Public key for the subscription.
 *                     example: "abcd5678..."
 *     responses:
 *       200:
 *         description: Subscription added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Subscription added.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Subscription failed"
 *                 error: {}
 */   
router.post('/subscribe', uploads.none(), validateRequestBody(PushSubsSchema), NotificationController.subscribe);

/**
 * @swagger
 * /notifications/chat:
 *   post:
 *     summary: Push chat notification
 *     description: Sends a push notification for a new chat message.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user sending the message.
 *                 example: "John Doe"
 *               to_id:
 *                 type: bigint
 *                 description: The ID of the user being sent the message
 *                 example: 123
 *               room_id:
 *                 type: bigint
 *                 description: The ID of the chat room.
 *                 example: 12345
 *               message:
 *                 type: string
 *                 description: The message content.
 *                 example: "Hello! How are you?"
 *     responses:
 *       200:
 *         description: Push notification added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Push notification added.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to add push notification"
 *                 error: {}
 */
router.post('/push/chat', uploads.none(), validateRequestBody(PushChatNotificationSchema), NotificationController.pushChat);

/**
 * @swagger
 * /notifications/feed:
 *   post:
 *     summary: Push feed notification
 *     description: Sends a push notification for a new feed post.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user who created the feed post.
 *                 example: "Jane Doe"
 *               user_id:
 *                 type: bigint
 *                 description: The ID of the author of the feed
 *                 example: 123
 *               content:
 *                 type: string
 *                 description: The content of the feed post.
 *                 example: "Check out my new blog post!"
 *     responses:
 *       200:
 *         description: Push notification added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Push notification added.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 success: false
 *                 message: "Failed to add push notification"
 *                 error: {}
 */
router.post('/push/feed', uploads.none(), validateRequestBody(PushFeedNotificationSchema), NotificationController.pushFeed);

export default router;