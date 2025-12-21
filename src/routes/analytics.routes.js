import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getHabitAnalytics } from "../controllers/analytics.controllers.js";

const router = Router()

router.route('/habits/:id/analytics').get(verifyJWT, getHabitAnalytics)

export default router