import { Router } from "express";
import multer from "multer";
import { authJWT } from "../middleware/auth";

import { UserController } from "../controller/UserController";
import { ProfileController, upload } from "../controller/ProfileController";

const uploads = multer();

const router: Router = Router();

// user route
router.post('/login', uploads.none(), UserController.login);
router.post('/register', uploads.none(), UserController.register);

// profile routes
router.get('/profile/:userId', ProfileController.getProfile); 
router.put('/profile/:userId', authJWT, upload.single('profile_photo'), ProfileController.profilUpdate);

export default router;