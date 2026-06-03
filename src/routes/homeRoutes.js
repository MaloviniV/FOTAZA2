import { Router } from "express";
import { showWallPublic, /* contact, */} from "../controllers/homeController.js";

const router = Router();

router.get("/", showWallPublic);

export default router;