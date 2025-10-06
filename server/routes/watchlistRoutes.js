// server/routes/watchlistRoutes.js
import express from "express";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlist,
  checkWatchlist,
} from "../controllers/watchlistController.js";
import { protectAndSync } from "../middleware/auth.js";

const router = express.Router();

// All watchlist routes require authentication
router.use(protectAndSync);

// Watchlist CRUD operations
router.get("/", getWatchlist);
router.post("/", addToWatchlist);
router.put("/:type/:itemId", updateWatchlist);
router.delete("/:type/:itemId", removeFromWatchlist);
router.get("/:type/:itemId/check", checkWatchlist);

export default router;
