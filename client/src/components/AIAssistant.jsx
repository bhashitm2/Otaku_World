import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";
import { useWatchlist } from "../hooks/useWatchlist";
import { extractUserPreferences, getChatMemory, updateChatMemory } from "../utils/aiUtils";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User,
  Loader,
  RefreshCw,
  Star,
  Play
} from "lucide-react";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { watchlist } = useWatchlist();

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("ai_chat_history");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }
    loadSuggestions();
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ai_chat_history", JSON.stringify(messages.slice(-20))); // Keep last 20 messages
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSuggestions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/suggestions`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  };

  const getUserPreferences = () => {
    if (!user) return {};

    // Use enhanced preference extraction utility
    const preferences = extractUserPreferences(favorites, watchlist, user);
    
    // Add chat memory context
    const chatMemory = getChatMemory();
    preferences.recentQueries = chatMemory.recentQueries;
    preferences.preferredTopics = chatMemory.preferredTopics;

    return preferences;
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const userPreferences = getUserPreferences();
      const chatHistory = messages.slice(-5); // Last 5 messages for context

      const endpoint = user 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/chat`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/chat/public`;

      const headers = {
        'Content-Type': 'application/json'
      };

      // Add auth token if user is logged in
      if (user) {
        // Use the token from the auth context, or get a fresh one if needed
        let token = user.token;
        if (!token) {
          // Fallback: get fresh token from Firebase auth
          const { auth } = await import('../services/firebaseClient');
          if (auth.currentUser) {
            token = await auth.currentUser.getIdToken();
          }
        }
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: messageText,
          userPreferences,
          chatHistory
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.data.chatResponse,
          recommendations: data.data.recommendations || [],
          realAnimeData: data.data.realAnimeData || [],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);

        // Update chat memory with the query and any topics extracted
        const extractedTopics = data.data.recommendations?.flatMap(rec => rec.genres || []) || [];
        updateChatMemory(messageText, extractedTopics);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }

    } catch (error) {
      console.error("AI Chat Error:", error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm experiencing some technical difficulties right now. You can still browse anime using the search function or check out the trending section! 🎌",
        isError: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("ai_chat_history");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[90vw] h-[600px] max-h-[80vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-purple-100 text-xs">Anime Recommendation Expert</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="text-white hover:bg-white/20 p-1 rounded"
                  title="Clear chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <motion.div
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 font-medium">Welcome!</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    I'm your personal anime recommendation assistant! Ask me anything about anime - 
                    genres, moods, similar shows, or just tell me what you're in the mood for! 🎌
                  </p>
                  
                  {/* Quick Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-2">Try asking:</p>
                      <div className="space-y-1">
                        {suggestions.slice(0, 3).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 p-2 rounded transition-colors"
                          >
                            "{suggestion}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Message List */}
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {/* Loading Indicator with Typing Animation */}
              {isLoading && (
                <motion.div
                  className="flex items-start space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="bg-gray-700 text-gray-100 p-3 rounded-lg max-w-[80%]">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">AI is thinking</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about anime..."
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Message Bubble Component
const MessageBubble = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className="flex items-center space-x-2 mb-1">
          {isUser ? (
            <User className="w-4 h-4 text-blue-400" />
          ) : (
            <Bot className="w-4 h-4 text-purple-400" />
          )}
          <span className="text-xs text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className={`p-3 rounded-lg ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : message.isError 
              ? 'bg-red-500/20 border border-red-500/30 text-red-300'
              : 'bg-gray-700 text-gray-100'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* AI Recommendations */}
          {message.recommendations && message.recommendations.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="text-xs font-medium text-purple-300 flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Recommendations:
              </h4>
              {message.recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-800 rounded p-2 text-xs">
                  <div className="font-medium text-white">{rec.title}</div>
                  <div className="text-gray-400 mt-1">{rec.synopsis}</div>
                  {rec.genres && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {rec.genres.map((genre, gi) => (
                        <span key={gi} className="bg-purple-500/30 text-purple-300 px-1 py-0.5 rounded text-xs">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Real Anime Data */}
          {message.realAnimeData && message.realAnimeData.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-cyan-300 flex items-center mb-2">
                <Play className="w-3 h-3 mr-1" />
                From Database:
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {message.realAnimeData.slice(0, 3).map((anime, index) => (
                  <div key={index} className="bg-gray-800 rounded p-2 text-xs">
                    <div className="font-medium text-white">{anime.title}</div>
                    {anime.score && (
                      <div className="text-yellow-400">⭐ {anime.score}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;