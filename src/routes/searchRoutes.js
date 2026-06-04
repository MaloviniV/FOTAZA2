import { Router } from "express";
import { searchFiles } from "../controllers/searchController.js";

const router = Router();

router.get("/", searchFiles);

export default router;
