import express from "express";
import { getAnalytics } from "../controllers/admin.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = express.Router();

// ADMIN ONLY
router.get("/analytics", protect, authorize("admin"), getAnalytics);

export default router;