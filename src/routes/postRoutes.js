import { Router } from "express";
import {showFormPost, createPost, showPost, updatePost, deletePost,showFormFile} from "../controllers/postController.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.get("/showFormPost", showFormPost);  //LISTO

router.post("/", createPost); //listo
router.get("/:postId", showPost); //listo
router.put("/:postId", updatePost); //LISTO
router.delete("/:postId", deletePost);  //listo

router.get("/:postId/showFormFile", showFormFile);
//router.get("/uploadFile", formUploadFile)
//router.post("/formUploadFile", uploadMiddleware.single("file"), processFormUploadFile)



//router.post("/imageDetail", imageDetail);


export default router;
