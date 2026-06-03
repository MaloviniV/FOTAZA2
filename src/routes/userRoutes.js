import { Router } from "express";
import {
  showUserProfile,
  toggleFollow,
} from "../controllers/userController.js";

const router = Router();

router.get("/:id", showUserProfile);
router.post("/:id/follow", toggleFollow);

export default router;
