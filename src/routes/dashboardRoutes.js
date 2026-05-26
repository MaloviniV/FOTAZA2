import { Router } from "express";
import { showHome, showPosts } from "../controllers/dashboardController.js"; 
const router = Router();

router.get("/", showHome);

router.get("/posts", showPosts);

export default router;