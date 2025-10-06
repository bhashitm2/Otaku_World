// server/routes/mangaRoutes.js
import express from "express";
import {
  getTrendingManga,
  getTopManga,
  getMangaDetails,
  searchManga,
  getMangaGenres,
  getMangaByGenre,
  getRandomManga,
  getMangaCharacters,
  getMangaReviews,
  getMangaRecommendations,
} from "../controllers/mangaController.js";
import { protectAndSync } from "../middleware/auth.js";
import { cacheMiddleware } from "../utils/apiCaching.js";

const router = express.Router();

// Public routes with caching
router.get("/trending", cacheMiddleware(300), getTrendingManga); // 5 min cache
router.get("/top", cacheMiddleware(600), getTopManga); // 10 min cache
router.get("/search", cacheMiddleware(300), searchManga); // 5 min cache
router.get("/genres", cacheMiddleware(3600), getMangaGenres); // 1 hour cache
router.get("/genre/:genreId", cacheMiddleware(600), getMangaByGenre); // 10 min cache
router.get("/random", cacheMiddleware(60), getRandomManga); // 1 min cache

// Detailed routes with caching
router.get("/:id", cacheMiddleware(1800), getMangaDetails); // 30 min cache
router.get("/:id/characters", cacheMiddleware(1800), getMangaCharacters); // 30 min cache
router.get("/:id/reviews", cacheMiddleware(600), getMangaReviews); // 10 min cache
router.get(
  "/:id/recommendations",
  cacheMiddleware(1800),
  getMangaRecommendations
); // 30 min cache

export default router;
