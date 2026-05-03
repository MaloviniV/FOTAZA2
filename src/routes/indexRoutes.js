import { Router } from "express";
import { index, loadMoreImages } from "../controllers/indexController.js";

const router = Router();

router.get("/", index);

router.get("/loadImages", loadMoreImages);

export default router;