import { Router } from "express";
import { showWallPublic, loadMoreFiles} from "../controllers/homeController.js";

const router = Router();

router.get("/", showWallPublic);

router.post("/loadMoreFiles", loadMoreFiles);

export default router;