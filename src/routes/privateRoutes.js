import { Router } from "express";
import { showHome } from "../controllers/dashboardController.js"; 
const router = Router();

router.get("/dashboard", showHome);

export default router;