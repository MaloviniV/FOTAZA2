import { Router } from "express";
import { formUploadFile, processFormUploadFile, formPost, processFormPost, posts} from "../controllers/postController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.get("/formPost", formPost);
router.post("/formPost", processFormPost);

router.get("/uploadFile", formUploadFile)
router.post("/formUploadFile", uploadMiddleware.single("file"), processFormUploadFile)


router.get("/posts", posts);
//router.get("/:id", postDetail);
//router.post("/imageDetail", imageDetail);


export default router;
