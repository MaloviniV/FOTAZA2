import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { addImage } from "../controllers/imageController.js";

const router = Router();

router.post("/upload")