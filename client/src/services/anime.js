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

export const getTrendingAnime = async (page = 1) => {
  try {
    const response = await apiService.anime.getTrending({ page });
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

// ================== Manga APIs ==================
export const getTopManga = async (page = 1, limit = 25) => {
  try {
    const response = await apiService.manga.getTop({ page, limit });
    return response.data;
  } catch (error) {
    console.error("Error fetching top manga:", error);
    throw error;
  }
};

export const searchManga = async (query, page = 1, limit = 25) => {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  try {
    const response = await apiService.manga.search({
      q: query.trim(),
      page,
      limit,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching manga:", error);
    throw error;
  }
};

export const getMangaDetails = async (id) => {
  if (!id) throw new Error("Manga ID is required");

  try {
    const response = await apiService.manga.getDetails(id);
    return response.data;
  } catch (error) {
    console.error("Error fetching manga details:", error);
    throw error;
  }
};

export const getRelatedManga = async (animeId) => {
  try {
    const animeDetails = await getAnimeDetails(animeId);
    const relations = animeDetails.data.relations || [];

    // Filter for manga adaptations
    const mangaRelations = relations.filter(
      (relation) =>
        relation.relation.toLowerCase().includes("adaptation") ||
        relation.relation.toLowerCase().includes("manga") ||
        relation.relation.toLowerCase().includes("source")
    );

    // Get detailed info for each related manga (limit 3)
    const mangaPromises = mangaRelations.flatMap((relation) =>
      relation.entry
        .filter((entry) => entry.type === "manga")
        .slice(0, 3)
        .map((entry) => getMangaDetails(entry.mal_id).catch(() => null))
    );

    const mangaResults = await Promise.all(mangaPromises);
    return mangaResults.filter((manga) => manga !== null);
  } catch (error) {
    console.error("Error fetching related manga:", error);
    return [];
  }
};

// ================== Data Format Helpers ==================
export const formatCharacterData = (character) => ({
  id: character.mal_id,
  name: character.name || "Unknown Character",
  nameKanji: character.name_kanji,
  nicknames: character.nicknames || [],
  image: character.images?.jpg?.image_url || character.images?.webp?.image_url,
  about: character.about,
  favorites: character.favorites,
  url: character.url,
  animeography: character.anime || [],
  mangaography: character.manga || [],
  voiceActors: character.voices || [],
});

export const formatAnimeData = (anime) => ({
  id: anime.mal_id,
  title: anime.title || anime.title_english || "Unknown Title",
  titleEnglish: anime.title_english,
  titleJapanese: anime.title_japanese,
  image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
  imageSmall: anime.images?.jpg?.small_image_url,
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
});

export const formatMangaData = (manga) => ({
  id: manga.mal_id,
  title: manga.title || manga.title_english || "Unknown Title",
  titleEnglish: manga.title_english,
  titleJapanese: manga.title_japanese,
  image: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url,
  imageSmall: manga.images?.jpg?.small_image_url,
  score: manga.score,
  rank: manga.rank,
  popularity: manga.popularity,
  chapters: manga.chapters,
  volumes: manga.volumes,
  status: manga.status,
  type: manga.type,
  genres: manga.genres || [],
  synopsis: manga.synopsis,
  year: manga.published?.prop?.from?.year,
  published: manga.published,
  authors: manga.authors || [],
  serializations: manga.serializations || [],
  url: manga.url,
});
