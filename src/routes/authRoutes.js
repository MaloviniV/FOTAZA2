import { Router } from "express";
import { login, register } from "../controllers/authController.js";

const router = Router();

router.get("/login", login);
router.post("/login", login);

router.get("/register", register);
router.post("/register", register);

router.get("/logout", login);

export default router;