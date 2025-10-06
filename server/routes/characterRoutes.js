// server/routes/characterRoutes.js
import express from "express";
import {
  getCharacterDetails,
  searchCharacters,
  getTopCharacters,
  getRandomCharacter,
  getCharacterAnime,
  getCharacterManga,
  getCharacterPictures,
} from "../controllers/characterController.js";
import { protectAndSync } from "../middleware/auth.js";
import { cacheMiddleware } from "../utils/apiCaching.js";

const router = express.Router();

// Public routes with caching
router.get("/search", cacheMiddleware(300), searchCharacters); // 5 min cache
router.get("/top", cacheMiddleware(600), getTopCharacters); // 10 min cache
router.get("/random", cacheMiddleware(60), getRandomCharacter); // 1 min cache

// Detailed routes with caching
router.get("/:id", cacheMiddleware(1800), getCharacterDetails); // 30 min cache
router.get("/:id/anime", cacheMiddleware(1800), getCharacterAnime); // 30 min cache
router.get("/:id/manga", cacheMiddleware(1800), getCharacterManga); // 30 min cache
router.get("/:id/pictures", cacheMiddleware(3600), getCharacterPictures); // 1 hour cache

export default router;
