import { Router } from "express";
import { showHome } from "../controllers/dashboardController.js"; 
const router = Router();

router.get("/", showHome);

export default router;