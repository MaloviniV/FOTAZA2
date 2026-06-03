import { Router } from "express";
import { loadMoreFiles } from "../controllers/apiController.js";

const router = Router();

router.post("/loadMoreFiles", loadMoreFiles);

export default router;