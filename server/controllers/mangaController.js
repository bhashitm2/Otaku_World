// server/controllers/mangaController.js
import {
  fetchMangaData,
  fetchMangaDetails,
  fetchGenres,
} from "../utils/jikanHelper.js";

// Get manga list with search and filters
export const getManga = async (req, res) => {
  try {
    const {
      q = "",
      page = 1,
      limit = 25,
      genres,
      status,
      order_by = "popularity",
      sort = "asc",
    } = req.query;

    const options = {
      genres,
      status,
      order_by,
      sort,
    };

    const data = await fetchMangaData(q, parseInt(page), options);

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching manga:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch manga data",
      error: error.message,
    });
  }
};

// Get manga details by ID
export const getMangaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid manga ID is required",
      });
    }

    const data = await fetchMangaDetails(parseInt(id));

    res.json({
      success: true,
      data: data.data,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error fetching manga ${req.params.id}:`, error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Manga not found",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch manga details",
      error: error.message,
    });
  }
};

// Get manga genres
export const getMangaGenres = async (req, res) => {
  try {
    const data = await fetchGenres("manga");

    res.json({
      success: true,
      data: data.data,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching manga genres:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch manga genres",
      error: error.message,
    });
  }
};

// Get trending manga
export const getTrendingManga = async (req, res) => {
  try {
    const { page = 1, limit = 25 } = req.query;

    const data = await fetchMangaData("", parseInt(page), {
      order_by: "popularity",
    });

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching trending manga:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending manga",
      error: error.message,
    });
  }
};

// Get top manga
export const getTopManga = async (req, res) => {
  try {
    const { page = 1, limit = 25 } = req.query;

    const data = await fetchMangaData("", parseInt(page), {
      order_by: "score",
      sort: "desc",
    });

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching top manga:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top manga",
      error: error.message,
    });
  }
};

// Get manga details (alias)
export const getMangaDetails = getMangaById;

// Search manga (alias)
export const searchManga = getManga;

// Get manga by genre
export const getMangaByGenre = async (req, res) => {
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

    const data = await fetchMangaData("", parseInt(page), options);

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error fetching manga for genre ${genreId}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch manga by genre",
      error: error.message,
    });
  }
};

// Get random manga
export const getRandomManga = async (req, res) => {
  try {
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const data = await fetchMangaData("", randomPage, {
      order_by: "popularity",
    });

    if (data.data && data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.length);
      const randomManga = data.data[randomIndex];

      res.json({
        success: true,
        data: randomManga,
        cached: false,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No manga found",
      });
    }
  } catch (error) {
    console.error("Error fetching random manga:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch random manga",
      error: error.message,
    });
  }
};

// Get manga characters
export const getMangaCharacters = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid manga ID is required",
      });
    }

    res.json({
      success: true,
      message: "Characters endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(`Error fetching characters for manga ${id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch manga characters",
      error: error.message,
    });
  }
};

// Get manga reviews
export const getMangaReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid manga ID is required",
      });
    }

    res.json({
      success: true,
      message: "Reviews endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(`Error fetching reviews for manga ${id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch manga reviews",
      error: error.message,
    });
  }
};

// Get manga recommendations
export const getMangaRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid manga ID is required",
      });
    }

    res.json({
      success: true,
      message: "Recommendations endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(
      `Error fetching recommendations for manga ${id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to fetch manga recommendations",
      error: error.message,
    });
  }
};
