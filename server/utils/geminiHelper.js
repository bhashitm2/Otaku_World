import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askGemini(prompt, context = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Enhanced prompt with context
    const enhancedPrompt = `
You are an expert anime recommendation assistant. Based on the user's query, provide personalized anime recommendations.

${context.userPreferences ? `User Preferences:
- Favorite Genres: ${context.userPreferences.favoriteGenres || 'None specified'}
- Watchlist Count: ${context.userPreferences.watchlistCount || 0}
- Favorite Anime: ${context.userPreferences.favoriteAnime || 'None'}
- Previous Searches: ${context.userPreferences.previousSearches || 'None'}
` : ''}

User Query: "${prompt}"

Please respond with exactly 5 anime recommendations in the following JSON format only:
{
  "recommendations": [
    {
      "title": "Anime Title",
      "synopsis": "Brief 2-3 sentence description",
      "genres": ["Action", "Drama"],
      "rating": "8.5/10",
      "episodes": "24",
      "year": "2023",
      "reason": "Why this matches the user's query"
    }
  ],
  "chatResponse": "A friendly conversational response explaining your recommendations"
}

Focus on anime that match the user's query and preferences. Be conversational and helpful.
`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse as JSON, fallback to text response if parsing fails
    try {
      return JSON.parse(text);
    } catch (parseError) {
      // If JSON parsing fails, return a structured fallback
      return {
        recommendations: [],
        chatResponse: text,
        error: "Could not parse structured response"
      };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`AI Assistant temporarily unavailable: ${error.message}`);
  }
}

export async function generateAnimeQuery(userMessage, preferences = {}) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `
Based on this user message: "${userMessage}"
And their preferences: ${JSON.stringify(preferences)}

Generate a search query for the Jikan API to find relevant anime. 
Respond with just the search term, no explanation.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Query generation error:", error);
    return userMessage; // Fallback to original message
  }
}