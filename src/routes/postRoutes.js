import { Router } from "express";
import {formPost, processFormPost, formUploadFile, processFormUploadFile, showPostDetail} from "../controllers/postController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.get("/formPost", formPost);
router.post("/formPost", processFormPost);

router.get("/uploadFile", formUploadFile)
router.post("/formUploadFile", uploadMiddleware.single("file"), processFormUploadFile)

router.get("/postDetail/:postId", showPostDetail);


//router.post("/imageDetail", imageDetail);


export default router;
