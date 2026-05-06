import { Router } from "express";
import { loadMoreImages } from "../controllers/imageController.js";

const router = Router();

router.get("/loadImages", loadMoreImages);

export default router;