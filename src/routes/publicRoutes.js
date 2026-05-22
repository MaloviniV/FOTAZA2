import { Router } from "express";
import { index, /* contact, */} from "../controllers/indexController.js";

const router = Router();

router.get("/", index);

//router.get("/contacto", contact);

export default router;