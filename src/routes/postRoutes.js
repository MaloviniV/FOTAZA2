import { Router } from "express";
import {showFormPost, createPost, showPost, updatePost, deletePost} from "../controllers/postController.js";
import fileRoutes from "./fileRoutes.js";

const router = Router();

router.get("/showFormPost", showFormPost);  //LISTO

router.post("/", createPost); //listo
router.get("/:postId", showPost); //listo
router.put("/:postId", updatePost); //LISTO
router.delete("/:postId", deletePost);  //listo

router.use("/:postId/file", fileRoutes);

export default router;