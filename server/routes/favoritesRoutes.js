// server/routes/favoritesRoutes.js
import express from "express";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  updateFavorite,
  checkFavorite,
} from "../controllers/favoritesController.js";
import { protectAndSync } from "../middleware/auth.js";

const router = express.Router();

// All favorites routes require authentication
router.use(protectAndSync);

// Favorites CRUD operations
router.get("/", getFavorites);
router.post("/", addToFavorites);
router.put("/:type/:itemId", updateFavorite);
router.delete("/:type/:itemId", removeFromFavorites);
router.get("/:type/:itemId/check", checkFavorite);

export default router;
