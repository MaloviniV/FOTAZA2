import { Router } from "express";
import { login, register } from "../controllers/authController.js";

const router = Router();

router.get("/", login);

router.get("/register", register);

export default router;