import { Router } from "express";
import { loadMoreFiles } from "../controllers/apiController.js";
import { rateFile } from "../controllers/fileController.js";
import { requireAuth } from "../middlewares/authMidleware.js";

const router = Router();

router.post("/loadMoreFiles", loadMoreFiles);

router.post("/file/:fileId/rate", requireAuth, rateFile)

export default router;