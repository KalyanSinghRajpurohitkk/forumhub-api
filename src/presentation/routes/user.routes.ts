import express from "express";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = express.Router();

// USER PROFILE
router.get("/profile", protect, (req: any, res) => {
  res.json({
    message: "Access granted ",
    user: req.user,
  });
});

// ADMIN ONLY ROUTE 
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin ",
  });
});

export default router;