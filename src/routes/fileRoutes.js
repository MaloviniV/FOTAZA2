import { Router } from "express";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { requireAuth } from "../middlewares/authMidleware.js";
import {
  showFormFile,
  createFile,
  showFile,
  updateFile,
  deleteFile,
  addComment,
  deleteComment,
  rateFile,
} from "../controllers/fileController.js";

const router = Router({ mergeParams: true });

router.get("/", showFormFile);

router.post("/", uploadMiddleware.single("file"), createFile);

router.get("/:fileId", showFile);
router.put("/:fileId", uploadMiddleware.single("file"), updateFile);
router.delete("/:fileId", deleteFile);
router.post("/:fileId/rate", requireAuth, rateFile);
router.post("/:fileId/comment", addComment);
router.delete("/:fileId/comment/:commentId", deleteComment);

export default router;
