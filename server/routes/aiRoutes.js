import express from "express";
import { chatWithAI, getAIStatus, getChatSuggestions } from "../controllers/aiController.js";
import { protectAndSync } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/status", getAIStatus);
router.get("/suggestions", getChatSuggestions);

// Protected routes - require authentication for personalized responses
router.post("/chat", protectAndSync, chatWithAI);

// Public chat route for non-authenticated users (limited functionality)
router.post("/chat/public", chatWithAI);

export default router;