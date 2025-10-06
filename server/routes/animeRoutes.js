// server/routes/animeRoutes.js
import express from "express";
import {
  getTrendingAnime,
  getTopAnime,
  getAnimeDetails,
  searchAnime,
  getAnimeGenres,
  getAnimeByGenre,
  getRandomAnime,
  getAnimeCharacters,
  getAnimeEpisodes,
  getAnimeReviews,
  getAnimeRecommendations,
  getSeasonalAnime,
} from "../controllers/animeController.js";
import { protectAndSync } from "../middleware/auth.js";
import { cacheMiddleware } from "../utils/apiCaching.js";

const router = express.Router();

// Public routes with caching
router.get("/trending", cacheMiddleware(300), getTrendingAnime); // 5 min cache
router.get("/top", cacheMiddleware(600), getTopAnime); // 10 min cache
router.get("/search", cacheMiddleware(300), searchAnime); // 5 min cache
router.get("/genres", cacheMiddleware(3600), getAnimeGenres); // 1 hour cache
router.get("/genre/:genreId", cacheMiddleware(600), getAnimeByGenre); // 10 min cache
router.get("/random", cacheMiddleware(60), getRandomAnime); // 1 min cache
router.get("/seasonal", cacheMiddleware(3600), getSeasonalAnime); // 1 hour cache

// Detailed routes with caching
router.get("/:id", cacheMiddleware(1800), getAnimeDetails); // 30 min cache
router.get("/:id/characters", cacheMiddleware(1800), getAnimeCharacters); // 30 min cache
router.get("/:id/episodes", cacheMiddleware(3600), getAnimeEpisodes); // 1 hour cache
router.get("/:id/reviews", cacheMiddleware(600), getAnimeReviews); // 10 min cache
router.get(
  "/:id/recommendations",
  cacheMiddleware(1800),
  getAnimeRecommendations
); // 30 min cache

export default router;
