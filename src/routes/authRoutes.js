import { Router } from "express";
import { login, register, processLogin, prossesRegister } from "../controllers/authController.js";

const router = Router();

router.get("/login", login);
router.post("/login", processLogin);

router.get("/register", register);
router.post("/register", prossesRegister);

router.get("/logout", login);

export default router;