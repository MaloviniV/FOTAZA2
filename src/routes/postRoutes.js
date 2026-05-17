import { Router } from "express";
import { formPost, processPost, posts, postDetail } from "../controllers/postController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";

const router = Router();
router.get("/", posts);
router.get("/:id", postDetail);

router.get("/formPost", formPost);

router.post("/formPost/upload", uploadMiddleware.single("image"), processPost);

export default router;
