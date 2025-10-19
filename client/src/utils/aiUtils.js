// Utility to extract and process user preferences for AI recommendations
export const extractUserPreferences = (favorites = [], watchlist = [], user = null) => {
  const preferences = {
    favoriteGenres: [],
    favoriteAnime: [],
    watchlistCount: 0,
    preferredRatings: [],
    recentActivity: [],
    userId: user?.uid || null
  };

  // Extract favorite genres from user's favorites
  if (favorites && favorites.length > 0) {
    const genreCount = {};
    
    favorites.forEach(anime => {
      if (anime.genres && Array.isArray(anime.genres)) {
        anime.genres.forEach(genre => {
          const genreName = typeof genre === 'string' ? genre : genre.name;
          genreCount[genreName] = (genreCount[genreName] || 0) + 1;
        });
      }
    });

    // Sort genres by frequency and take top 10
    preferences.favoriteGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([genre]) => genre);

    // Extract favorite anime titles
    preferences.favoriteAnime = favorites
      .slice(0, 8) // Top 8 favorite anime
      .map(anime => anime.title || anime.name)
      .filter(Boolean);

    // Extract preferred rating ranges
    const ratings = favorites
      .map(anime => parseFloat(anime.score))
      .filter(score => !isNaN(score) && score > 0);
    
    if (ratings.length > 0) {
      const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      preferences.preferredRatings = [
        Math.max(1, avgRating - 1), // Lower bound
        Math.min(10, avgRating + 1)  // Upper bound
      ];
    }
  }

  // Watchlist information
  if (watchlist && watchlist.length > 0) {
    preferences.watchlistCount = watchlist.length;
    
    // Recent activity from watchlist
    preferences.recentActivity = watchlist
      .slice(-5) // Last 5 items added to watchlist
      .map(anime => anime.title || anime.name)
      .filter(Boolean);
  }

  return preferences;
};

export const generateContextualPrompt = (userMessage, preferences) => {
  let context = "";

  if (preferences.favoriteGenres && preferences.favoriteGenres.length > 0) {
    context += `User's favorite genres: ${preferences.favoriteGenres.join(", ")}. `;
  }

  if (preferences.favoriteAnime && preferences.favoriteAnime.length > 0) {
    context += `User's favorite anime include: ${preferences.favoriteAnime.slice(0, 3).join(", ")}. `;
  }

  if (preferences.preferredRatings && preferences.preferredRatings.length === 2) {
    context += `User tends to enjoy anime rated between ${preferences.preferredRatings[0].toFixed(1)} and ${preferences.preferredRatings[1].toFixed(1)}. `;
  }

  if (preferences.watchlistCount > 0) {
    context += `User has ${preferences.watchlistCount} anime in their watchlist. `;
  }

  if (preferences.recentActivity && preferences.recentActivity.length > 0) {
    context += `Recently added to watchlist: ${preferences.recentActivity.slice(0, 2).join(", ")}. `;
  }

  return context;
};

export const formatAnimeForAI = (animeData) => {
  if (!animeData || !Array.isArray(animeData)) return [];

  return animeData.map(anime => ({
    title: anime.title || anime.title_english || 'Unknown Title',
    synopsis: anime.synopsis ? 
      anime.synopsis.substring(0, 200) + (anime.synopsis.length > 200 ? '...' : '') : 
      'No synopsis available',
    genres: anime.genres ? anime.genres.map(g => g.name || g).slice(0, 5) : [],
    rating: anime.score ? `${anime.score}/10` : 'Not rated',
    episodes: anime.episodes || 'Unknown',
    year: anime.year || anime.aired?.prop?.from?.year || 'Unknown',
    malId: anime.mal_id,
    imageUrl: anime.images?.jpg?.image_url || anime.images?.webp?.image_url
  }));
};

export const getChatMemory = () => {
  try {
    const memory = localStorage.getItem('ai_chat_memory');
    return memory ? JSON.parse(memory) : {
      recentQueries: [],
      preferredTopics: [],
      lastInteraction: null
    };
  } catch (error) {
    console.error('Failed to load chat memory:', error);
    return {
      recentQueries: [],
      preferredTopics: [],
      lastInteraction: null
    };
  }
};

export const updateChatMemory = (query, topics = []) => {
  try {
    const memory = getChatMemory();
    
    // Add recent query (keep last 10)
    memory.recentQueries = [
      query,
      ...memory.recentQueries.filter(q => q !== query)
    ].slice(0, 10);

    // Update preferred topics
    topics.forEach(topic => {
      if (!memory.preferredTopics.includes(topic)) {
        memory.preferredTopics.push(topic);
      }
    });
    
    // Keep only last 15 preferred topics
    memory.preferredTopics = memory.preferredTopics.slice(-15);
    memory.lastInteraction = new Date().toISOString();

    localStorage.setItem('ai_chat_memory', JSON.stringify(memory));
  } catch (error) {
    console.error('Failed to update chat memory:', error);
  }
};