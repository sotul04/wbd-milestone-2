import { Router } from "express";
import multer from "multer";
import { UserController, upload } from "../controller/UserController";
import { authJWT } from "../middleware/auth";

const uploads = multer();

const router: Router = Router();

// user route
router.post('/login', uploads.none(), UserController.login);
router.post('/register', uploads.none(), UserController.register);
router.put('/profil/:userId', authJWT, upload.single('profile_photo'), UserController.profilUpdate);

export default router;