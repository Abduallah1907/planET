import { Router } from "express";
import { createActivity } from "../controllers/Activity_Con";
const router = Router();

router.post("/addactivity", createActivity);

export default router;
