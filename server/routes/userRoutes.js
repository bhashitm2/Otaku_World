// server/routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  getUserActivity,
  deleteUserAccount,
  getUserPreferences,
  updateUserPreferences,
} from "../controllers/userController.js";
import { protectAndSync } from "../middleware/auth.js";

const router = express.Router();

// All user routes require authentication
router.use(protectAndSync);

// User profile routes
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.delete("/account", deleteUserAccount);

// User data routes
router.get("/stats", getUserStats);
router.get("/activity", getUserActivity);

// User preferences routes
router.get("/preferences", getUserPreferences);
router.put("/preferences", updateUserPreferences);

export default router;
