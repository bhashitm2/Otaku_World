import { askGemini, generateAnimeQuery } from "../utils/geminiHelper.js";
import { fetchAnimeData } from "../utils/jikanHelper.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message, userPreferences = {}, chatHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        error: "Message is required" 
      });
    }

    // Build context from user preferences
    const context = {
      userPreferences: {
        favoriteGenres: userPreferences.favoriteGenres || [],
        watchlistCount: userPreferences.watchlistCount || 0,
        favoriteAnime: userPreferences.favoriteAnime || [],
        previousSearches: chatHistory.slice(-3).map(h => h.message) || []
      }
    };

    // Get AI response with recommendations
    const aiResponse = await askGemini(message, context);
    
    // If AI response includes recommendations, enhance with real data
    if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
      try {
        // Generate a search query for additional real data
        const searchQuery = await generateAnimeQuery(message, userPreferences);
        const realAnimeData = await fetchAnimeData(searchQuery, 1);
        
        // Merge AI recommendations with real anime data if available
        if (realAnimeData?.data?.length > 0) {
          aiResponse.realAnimeData = realAnimeData.data.slice(0, 5);
        }
      } catch (searchError) {
        console.warn("Could not fetch real anime data:", searchError.message);
      }
    }

    // Add metadata
    aiResponse.timestamp = new Date().toISOString();
    aiResponse.userQuery = message;

    res.json({
      success: true,
      data: aiResponse
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    
    // Provide fallback response
    res.status(500).json({ 
      error: "AI Assistant is temporarily unavailable. Please try again later.",
      fallback: {
        chatResponse: "I'm sorry, I'm experiencing some technical difficulties right now. You can still browse anime using the search function or check out the trending section!",
        recommendations: []
      }
    });
  }
};

export const getAIStatus = async (req, res) => {
  try {
    // Simple health check for Gemini API
    const testResponse = await askGemini("Hello", {});
    res.json({ 
      status: "online", 
      message: "AI Assistant is ready to help!" 
    });
  } catch (error) {
    res.status(503).json({ 
      status: "offline", 
      message: "AI Assistant is currently unavailable" 
    });
  }
};

export const getChatSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "Suggest some action anime like Attack on Titan",
      "I want wholesome slice-of-life anime recommendations", 
      "Find me dark fantasy anime series",
      "What are the best romance anime of 2024?",
      "Recommend anime similar to Death Note",
      "I'm looking for short anime series to binge watch"
    ];

    res.json({
      success: true,
      suggestions: suggestions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};