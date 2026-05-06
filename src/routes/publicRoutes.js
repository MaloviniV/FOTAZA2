import { Router } from "express";
import { index, contact, plans } from "../controllers/indexController.js";

const router = Router();

router.get("/", index);

router.get("/contacto", contact);

router.get("/plans", plans);

export default router;