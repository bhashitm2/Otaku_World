# AI Assistant Setup Guide

## Overview
The AI Assistant is a conversational anime recommendation system powered by Google's Gemini API. It provides personalized anime recommendations based on user preferences, watchlist, and favorites.

## Features Implemented

### ✅ Backend Features
- **Gemini API Integration**: Smart anime recommendations with context awareness
- **User Context**: Integrates with Firebase auth, favorites, and watchlist data
- **Fallback System**: Graceful error handling with Jikan API backup
- **Rate Limiting**: Protected endpoints with proper authentication
- **Memory System**: Tracks user preferences and chat history

### ✅ Frontend Features
- **Floating Chat UI**: Elegant chat interface with animations
- **Personalized Recommendations**: Uses user's favorite genres and anime
- **Real-time Responses**: Streaming-like chat experience with typing indicators
- **Memory Persistence**: Remembers conversation history with localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication Integration**: Enhanced features for logged-in users

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select existing one
3. Generate an API key
4. Copy the API key

### 2. Configure Backend
1. Add your Gemini API key to `server/.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

2. Install dependencies (already done):
```bash
cd server
npm install @google/generative-ai
```

### 3. Start the Servers
1. Start backend server:
```bash
cd server
npm run dev
```

2. Start frontend client:
```bash
cd client
npm run dev
```

### 4. Test the AI Assistant
1. Open your application
2. Look for the floating AI assistant button (bottom-right corner)
3. Click to open the chat interface
4. Try sample queries:
   - "Suggest some action anime like Attack on Titan"
   - "I want wholesome slice-of-life recommendations"
   - "Find me dark fantasy anime series"

## API Endpoints

### Public Endpoints
- `GET /api/ai/status` - Check AI service status
- `GET /api/ai/suggestions` - Get conversation starters
- `POST /api/ai/chat/public` - Public chat (limited functionality)

### Protected Endpoints (Require Authentication)
- `POST /api/ai/chat` - Personalized chat with user context

## Architecture

### Backend Components
```
server/
├── controllers/aiController.js     # Main AI logic and API handling
├── routes/aiRoutes.js             # Express routes for AI endpoints  
├── utils/geminiHelper.js          # Gemini API wrapper functions
└── .env                          # Environment variables (add GEMINI_API_KEY)
```

### Frontend Components  
```
client/src/
├── components/AIAssistant.jsx     # Main chat UI component
├── utils/aiUtils.js              # Helper functions for preferences
└── App.jsx                       # Integration point (already added)
```

## User Experience Flow

### For Logged-in Users
1. **Personalized Context**: AI considers user's favorite genres, watchlist, and favorite anime
2. **Enhanced Recommendations**: Tailored suggestions based on viewing history
3. **Memory Persistence**: Remembers conversation across sessions

### For Guest Users  
1. **General Recommendations**: Basic anime suggestions without personalization
2. **Limited Features**: No preference tracking or advanced memory
3. **Public Access**: Can still use core recommendation features

## Customization Options

### Modify AI Personality
Edit the prompt in `server/utils/geminiHelper.js`:
```javascript
const enhancedPrompt = `
You are an expert anime recommendation assistant...
// Customize personality and behavior here
`;
```

### Adjust Recommendation Count
Change the number of recommendations in `aiController.js`:
```javascript
const realAnimeData = await searchAnime(searchQuery, 1, 10); // Change 10 to desired count
```

### Customize UI Theme
Modify colors and styling in `AIAssistant.jsx`:
```javascript
className="bg-gradient-to-r from-purple-600 to-pink-600" // Change gradient colors
```

## Troubleshooting

### Common Issues

1. **AI Not Responding**
   - Check if GEMINI_API_KEY is set correctly in server/.env
   - Verify internet connection and API quota
   - Check server logs for specific errors

2. **Personalization Not Working**
   - Ensure user is logged in with Firebase Auth
   - Check if favorites/watchlist data is available
   - Verify authentication token is being sent

3. **Chat Memory Issues**
   - Clear browser localStorage: `localStorage.removeItem("ai_chat_history")`
   - Check browser console for storage errors

### Debug Mode
Enable detailed logging by adding this to server console:
```javascript
console.log("AI Request:", { message, userPreferences, chatHistory });
console.log("AI Response:", aiResponse);
```

## Performance Optimizations

- **Caching**: Responses cached for common queries
- **Rate Limiting**: Prevents API abuse and reduces costs  
- **Fallback System**: Uses Jikan API when Gemini is unavailable
- **Memory Management**: Limited chat history (20 messages max)
- **Lazy Loading**: Chat UI only loads when needed

## Security Features

- **Authentication**: Protected endpoints for personalized features
- **Input Validation**: Sanitized user inputs to prevent injection
- **Error Handling**: No sensitive data leaked in error messages
- **Rate Limiting**: Prevents API abuse

## Future Enhancements

### Potential Features
- **Voice Input**: Speech-to-text for hands-free interaction
- **Anime Cards**: Rich UI cards for recommendations instead of text
- **Watch Together**: Group recommendations for multiple users
- **Smart Notifications**: Proactive recommendations based on trends
- **Advanced Memory**: Long-term preference learning
- **Multi-language**: Support for different languages

### Integration Ideas
- **MyAnimeList Integration**: Import user data from external services
- **Social Features**: Share recommendations with friends
- **Calendar Integration**: Seasonal anime recommendations
- **Mood Analysis**: Recommendations based on time/weather/mood

## Cost Management

The AI Assistant uses Gemini API which has usage-based pricing:
- **Free Tier**: 60 requests per minute, 1500 requests per day
- **Paid Tiers**: Available for higher usage
- **Optimization**: Caching and fallbacks reduce API calls

Monitor usage at [Google AI Studio](https://aistudio.google.com/) to track costs.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server/client logs for specific errors  
3. Test with sample API calls to isolate issues
4. Check Gemini API status and quotas

The AI Assistant is now fully integrated and ready to provide personalized anime recommendations! 🎌✨