// server/controllers/animeController.js
import {
  fetchAnimeData,
  fetchAnimeDetails,
  fetchTopAnime,
  fetchGenres,
  fetchSeasons,
} from "../utils/jikanHelper.js";
import { getCacheStats } from "../utils/apiCaching.js";

// Get anime list with search and filters
export const getAnime = async (req, res) => {
  try {
    const {
      q = "",
      page = 1,
      limit = 25,
      genres,
      status,
      rating,
      order_by = "popularity",
      sort = "asc",
    } = req.query;

    const options = {
      genres,
      status,
      rating,
      order_by,
      sort,
    };

    const data = await fetchAnimeData(q, parseInt(page), options);

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching anime:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch anime data",
      error: error.message,
    });
  }
};

// Get anime details by ID
export const getAnimeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid anime ID is required",
      });
    }

    const data = await fetchAnimeDetails(parseInt(id));

    res.json({
      success: true,
      data: data.data,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error fetching anime ${req.params.id}:`, error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Anime not found",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch anime details",
      error: error.message,
    });
  }
};

// Get top anime
export const getTopAnime = async (req, res) => {
  try {
    const { type = "anime", filter = "bypopularity", page = 1 } = req.query;

    const data = await fetchTopAnime(type, filter, parseInt(page));

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching top anime:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top anime",
      error: error.message,
    });
  }
};

// Get anime genres
export const getAnimeGenres = async (req, res) => {
  try {
    const data = await fetchGenres("anime");

    res.json({
      success: true,
      data: data.data,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching anime genres:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch anime genres",
      error: error.message,
    });
  }
};

// Get seasonal anime
export const getSeasonalAnime = async (req, res) => {
  try {
    const { year, season } = req.params;

    if (!year || !season) {
      return res.status(400).json({
        success: false,
        message: "Year and season are required",
      });
    }

    const data = await fetchSeasons(parseInt(year), season.toLowerCase());

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      `Error fetching seasonal anime ${req.params.year}/${req.params.season}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to fetch seasonal anime",
      error: error.message,
    });
  }
};

// Get trending anime
export const getTrendingAnime = async (req, res) => {
  try {
    const { page = 1, limit = 25 } = req.query;

    // Get current season anime for truly trending content
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Determine current season
    const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
    let currentSeason;
    if (month >= 3 && month <= 5) {
      currentSeason = "spring";
    } else if (month >= 6 && month <= 8) {
      currentSeason = "summer";
    } else if (month >= 9 && month <= 11) {
      currentSeason = "fall";
    } else {
      currentSeason = "winter";
    }

    console.log(`🔥 Fetching trending anime for ${currentSeason} ${currentYear}`);

    let allTrendingData = [];
    
    try {
      // Fetch current season anime first
      const seasonData = await fetchSeasons(currentYear, currentSeason);
      if (seasonData.data) {
        allTrendingData = [...seasonData.data];
      }
    } catch (seasonError) {
      console.warn(`Failed to fetch ${currentSeason} ${currentYear} season:`, seasonError.message);
    }

    // If we don't have enough data, supplement with recent popular anime
    if (allTrendingData.length < 100) {
      try {
        const recentData = await fetchAnimeData("", 1, {
          order_by: "start_date",
          sort: "desc",
        });
        if (recentData.data) {
          // Add recent anime but avoid duplicates
          const existingIds = new Set(allTrendingData.map(anime => anime.mal_id));
          const newAnime = recentData.data.filter(anime => !existingIds.has(anime.mal_id));
          allTrendingData = [...allTrendingData, ...newAnime];
        }
      } catch (recentError) {
        console.warn("Failed to fetch recent anime:", recentError.message);
      }
    }

    // If still not enough, add some popular ongoing anime
    if (allTrendingData.length < 150) {
      try {
        const popularData = await fetchTopAnime("anime", "airing", 1);
        if (popularData.data) {
          const existingIds = new Set(allTrendingData.map(anime => anime.mal_id));
          const newAnime = popularData.data.filter(anime => !existingIds.has(anime.mal_id));
          allTrendingData = [...allTrendingData, ...newAnime.slice(0, 50)];
        }
      } catch (popularError) {
        console.warn("Failed to fetch popular airing anime:", popularError.message);
      }
    }

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = allTrendingData.slice(startIndex, endIndex);

    // Create pagination info
    const totalItems = allTrendingData.length;
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        current_page: parseInt(page),
        has_next_page: parseInt(page) < totalPages,
        last_visible_page: totalPages,
        items: {
          count: paginatedData.length,
          total: totalItems,
          per_page: parseInt(limit),
        },
      },
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching trending anime:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending anime",
      error: error.message,
    });
  }
};

// Get anime details (alias for getAnimeById)
export const getAnimeDetails = getAnimeById;

// Search anime
export const searchAnime = getAnime;

// Get anime by genre
export const getAnimeByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const { page = 1, limit = 25 } = req.query;

    if (!genreId || isNaN(genreId)) {
      return res.status(400).json({
        success: false,
        message: "Valid genre ID is required",
      });
    }

    const options = {
      genres: genreId,
    };

    const data = await fetchAnimeData("", parseInt(page), options);

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error fetching anime for genre ${genreId}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch anime by genre",
      error: error.message,
    });
  }
};

// Get random anime
export const getRandomAnime = async (req, res) => {
  try {
    // Get a random page from 1-100 and pick first result
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const data = await fetchAnimeData("", randomPage, {
      order_by: "popularity",
    });

    if (data.data && data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.length);
      const randomAnime = data.data[randomIndex];

      res.json({
        success: true,
        data: randomAnime,
        cached: false,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No anime found",
      });
    }
  } catch (error) {
    console.error("Error fetching random anime:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch random anime",
      error: error.message,
    });
  }
};

// Get anime characters
export const getAnimeCharacters = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid anime ID is required",
      });
    }

    // This would need to be implemented in jikanHelper.js
    res.json({
      success: true,
      message: "Characters endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(`Error fetching characters for anime ${id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch anime characters",
      error: error.message,
    });
  }
};

// Get anime episodes
export const getAnimeEpisodes = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid anime ID is required",
      });
    }

    // This would need to be implemented in jikanHelper.js
    res.json({
      success: true,
      message: "Episodes endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(`Error fetching episodes for anime ${id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch anime episodes",
      error: error.message,
    });
  }
};

// Get anime reviews
export const getAnimeReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid anime ID is required",
      });
    }

    // This would need to be implemented in jikanHelper.js
    res.json({
      success: true,
      message: "Reviews endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(`Error fetching reviews for anime ${id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch anime reviews",
      error: error.message,
    });
  }
};

// Get anime recommendations
export const getAnimeRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid anime ID is required",
      });
    }

    // This would need to be implemented in jikanHelper.js
    res.json({
      success: true,
      message: "Recommendations endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(
      `Error fetching recommendations for anime ${id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to fetch anime recommendations",
      error: error.message,
    });
  }
};

// Cache management endpoint (admin only)
export const getCacheStatus = async (req, res) => {
  try {
    const stats = getCacheStats();

    res.json({
      success: true,
      cache: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting cache stats:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get cache statistics",
      error: error.message,
    });
  }
};
