import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getHabitLogs, upsertHabitLog } from "../controllers/habitLog.controllers.js";

const router = Router()

router.route('/habits/:id/log').post(verifyJWT, upsertHabitLog)
router.route('/habits/:id/logs').get(verifyJWT, getHabitLogs)

export default router;