// src/services/anime.js
import { apiService } from "./api.js";

// Use backend API instead of direct Jikan API calls
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Request queue to prevent too many simultaneous requests
class RequestQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running || this.queue.length === 0) {
      return;
    }

    this.running = true;

    while (this.queue.length > 0) {
      const { requestFn, resolve, reject } = this.queue.shift();

      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.running = false;
  }
}

/* Unused - backend handles all of this
const requestQueue = new RequestQueue();

// Enhanced request delay to respect Jikan API rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1500; // 1.5 seconds
const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 5000, 10000]; // Progressive retry delays
*/

/* Unused - backend handles requests
const makeRequest = async (url, retryCount = 0) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  // Ensure minimum interval between requests
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }

  lastRequestTime = Date.now();

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Handle rate limiting (429) or server errors (500)
      if (
        (response.status === 429 || response.status === 500) &&
        retryCount < MAX_RETRIES
      ) {
        const retryDelay = RETRY_DELAYS[retryCount];
        console.warn(
          `Error ${response.status}. Retrying in ${retryDelay}ms... (Attempt ${
            retryCount + 1
          }/${MAX_RETRIES})`
        );
        await delay(retryDelay);
        return makeRequest(url, retryCount + 1);
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (
      retryCount < MAX_RETRIES &&
      (error.name === "TypeError" || error.message.includes("fetch"))
    ) {
      // Network error, retry
      const retryDelay = RETRY_DELAYS[retryCount];
      console.warn(
        `Network error. Retrying in ${retryDelay}ms... (Attempt ${
          retryCount + 1
        }/${MAX_RETRIES})`
      );
      await delay(retryDelay);
      return makeRequest(url, retryCount + 1);
    }

    console.error(
      `API request failed for ${url} after ${retryCount + 1} attempts:`,
      error
    );
    throw error;
  }
};
*/

// ================== Anime APIs ==================
export const getTopAnime = async (page = 1, limit = 25) => {
  try {
    const response = await apiService.anime.getTop({ page, limit });
    return response.data;
  } catch (error) {
    console.error("Error fetching top anime:", error);
    throw error;
  }
};

export const searchAnime = async (query, page = 1, limit = 25) => {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  try {
    const response = await apiService.anime.search({
      q: query.trim(),
      page,
      limit,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
};

export const getAnimeDetails = async (id) => {
  if (!id) throw new Error("Anime ID is required");

  try {
    const response = await apiService.anime.getDetails(id);
    return response.data;
  } catch (error) {
    console.error("Error fetching anime details:", error);
    throw error;
  }
};

export const getAnimeRecommendations = async (id) => {
  if (!id) throw new Error("Anime ID is required");

  try {
    const response = await apiService.anime.getRecommendations(id);
    return response.data;
  } catch (error) {
    console.error("Error fetching anime recommendations:", error);
    throw error;
  }
};

export const getCurrentSeason = async (page = 1) => {
  try {
    const response = await apiService.anime.getSeasonal({ page });
    return response.data;
  } catch (error) {
    console.error("Error fetching current season anime:", error);
    throw error;
  }
};

export const getUpcomingSeason = async (page = 1) => {
  try {
    const response = await apiService.anime.getSeasonal({
      page,
      filter: "upcoming",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming season anime:", error);
    throw error;
  }
};

export const getTrendingAnime = async (page = 1, limit = 25) => {
  try {
    const response = await apiService.anime.getTrending({ page, limit });
    return response.data;
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    throw error;
  }
};

export const getAnimeGenres = async () => {
  try {
    const response = await apiService.anime.getGenres();
    return response.data;
  } catch (error) {
    console.error("Error fetching anime genres:", error);
    throw error;
  }
};

export const getAnimeByGenre = async (genreId, page = 1) => {
  try {
    const response = await apiService.anime.getByGenre(genreId, { page });
    return response.data;
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    throw error;
  }
};

export const getRandomAnime = async () => {
  try {
    const response = await apiService.anime.getRandom();
    return response.data;
  } catch (error) {
    console.error("Error fetching random anime:", error);
    throw error;
  }
};

// ================== Character APIs ==================
export const searchCharacters = async (query, page = 1, limit = 25) => {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  try {
    const response = await apiService.characters.search({
      q: query.trim(),
      page,
      limit,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching characters:", error);
    throw error;
  }
};

export const getCharacterDetails = async (id) => {
  if (!id) throw new Error("Character ID is required");

  try {
    const response = await apiService.characters.getDetails(id);
    return response.data;
  } catch (error) {
    console.error("Error fetching character details:", error);
    throw error;
  }
};

export const getTopCharacters = async (page = 1, limit = 25) => {
  try {
    const response = await apiService.characters.getTop({ page, limit });
    return response.data;
  } catch (error) {
    console.error("Error fetching top characters:", error);
    throw error;
  }
};

// ================== Manga APIs Removed ==================
// Manga functionality has been temporarily removed

// ================== Data Format Helpers ==================
export const formatCharacterData = (character) => ({
  id: character.mal_id,
  name: character.name || "Unknown Character",
  nameKanji: character.name_kanji,
  nicknames: character.nicknames || [],
  image:
    character.images?.jpg?.image_url ||
    character.images?.webp?.image_url ||
    "/placeholder-anime.jpg",
  about: character.about,
  favorites: character.favorites,
  url: character.url,
  animeography: character.anime || [],
  mangaography: character.manga || [],
  voiceActors: character.voices || [],
});

export const formatAnimeData = (anime) => {
  if (!anime) {
    console.warn("formatAnimeData received undefined anime data");
    return {
      id: null,
      title: "Unknown Title",
      titleEnglish: null,
      titleJapanese: null,
      image: "/placeholder-anime.jpg",
      imageSmall: "/placeholder-anime.jpg",
      score: null,
      rank: null,
      popularity: null,
      episodes: null,
      status: null,
      type: null,
      rating: null,
      genres: [],
      synopsis: null,
      aired: null,
      year: null,
      season: null,
      studios: [],
      producers: [],
      licensors: [],
      source: null,
      duration: null,
      url: null,
    };
  }

  return {
    id: anime.mal_id,
    title: anime.title || anime.title_english || "Unknown Title",
    titleEnglish: anime.title_english,
    titleJapanese: anime.title_japanese,
    image:
      anime.images?.jpg?.large_image_url ||
      anime.images?.jpg?.image_url ||
      "/placeholder-anime.jpg",
    imageSmall: anime.images?.jpg?.small_image_url || "/placeholder-anime.jpg",
    score: anime.score,
    rank: anime.rank,
    popularity: anime.popularity,
    episodes: anime.episodes,
    status: anime.status,
    type: anime.type,
    rating: anime.rating,
    genres: anime.genres || [],
    synopsis: anime.synopsis,
    year: anime.year || anime.aired?.prop?.from?.year,
    season: anime.season,
    studios: anime.studios || [],
    duration: anime.duration,
    aired: anime.aired,
    url: anime.url,
  };
};

// formatMangaData function removed - manga functionality disabled
