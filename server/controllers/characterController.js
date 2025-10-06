// server/controllers/characterController.js
import {
  fetchCharacterData,
  fetchCharacterDetails,
} from "../utils/jikanHelper.js";

// Get characters list with search
export const getCharacters = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 25, order_by, sort } = req.query;

    const options = {};
    if (order_by) options.order_by = order_by;
    if (sort) options.sort = sort;

    const data = await fetchCharacterData(q, parseInt(page), options);

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching characters:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch characters data",
      error: error.message,
    });
  }
};

// Get character details by ID
export const getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid character ID is required",
      });
    }

    const data = await fetchCharacterDetails(parseInt(id));

    res.json({
      success: true,
      data: data.data,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error fetching character ${req.params.id}:`, error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Character not found",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch character details",
      error: error.message,
    });
  }
};

// Get character details (alias)
export const getCharacterDetails = getCharacterById;

// Search characters (alias)
export const searchCharacters = getCharacters;

// Get top characters
export const getTopCharacters = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      order_by = "favorites",
      sort = "desc",
    } = req.query;

    const options = { order_by, sort };
    const data = await fetchCharacterData("", parseInt(page), options);

    res.json({
      success: true,
      data: data.data,
      pagination: data.pagination,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching top characters:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top characters",
      error: error.message,
    });
  }
};

// Get random character
export const getRandomCharacter = async (req, res) => {
  try {
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const data = await fetchCharacterData("", randomPage);

    if (data.data && data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.length);
      const randomCharacter = data.data[randomIndex];

      res.json({
        success: true,
        data: randomCharacter,
        cached: false,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No characters found",
      });
    }
  } catch (error) {
    console.error("Error fetching random character:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch random character",
      error: error.message,
    });
  }
};

// Get character anime
export const getCharacterAnime = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid character ID is required",
      });
    }

    res.json({
      success: true,
      message: "Character anime endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(`Error fetching anime for character ${id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch character anime",
      error: error.message,
    });
  }
};

// Get character manga
export const getCharacterManga = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid character ID is required",
      });
    }

    res.json({
      success: true,
      message: "Character manga endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(`Error fetching manga for character ${id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch character manga",
      error: error.message,
    });
  }
};

// Get character pictures
export const getCharacterPictures = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid character ID is required",
      });
    }

    res.json({
      success: true,
      message: "Character pictures endpoint not yet implemented",
      data: [],
    });
  } catch (error) {
    console.error(
      `Error fetching pictures for character ${id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to fetch character pictures",
      error: error.message,
    });
  }
};
