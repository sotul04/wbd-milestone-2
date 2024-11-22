import { Router } from "express";

import { UserController, upload } from "../controller/UserController";
import { authJWT } from "../middleware/auth";
import { handleUploadError } from "../middleware/file";

const router: Router = Router();

// user route
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.put('/profil/:userId', authJWT, upload.single('profile_photo'), UserController.profilUpdate);

export default router;